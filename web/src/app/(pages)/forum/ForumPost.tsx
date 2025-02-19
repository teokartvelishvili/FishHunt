"use client";

import { useState } from "react";
import "./ForumPost.css";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { fetchWithAuth } from "@/lib/fetch-with-auth";

interface Comment {
  id: string;
  text: string;
  author: {
    name: string;
    avatar: string;
  };
}

interface PostProps {
  id: string;
  image: string;
  text: string;
  category: string[];
  author: {
    name: string;
    avatar: string;
  };
  comments: Comment[];
  time: string;
  likes: number;
  isLiked: boolean;
  isAuthorized: boolean;
}

const ForumPost = ({
  id,
  image,
  text,
  category,
  author,
  comments,
  time,
  likes,
  isLiked,
  isAuthorized,
}: PostProps) => {
  const [newComment, setNewComment] = useState("");
  const queryClient = useQueryClient();

  const [likesCount, setLikes] = useState(likes); // ლაიქების რაოდენობა
  const [userLiked, setIsLiked] = useState(isLiked);

  const commentMutation = useMutation({
    mutationFn: async () => {
      const response = await fetchWithAuth(`/forums/add-comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "forum-id": id,
        },
        body: JSON.stringify({
          content: newComment,
        }),
      });
      return response.json();
    },
    onSuccess: () => {
      setNewComment("");
      queryClient.invalidateQueries({ queryKey: ["forums"] });
      toast({
        title: "Success",
        description: "Comment added successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const likeMutation = useMutation({
    mutationFn: async () => {
      const endpoint = userLiked ? "remove-like" : "add-like";
      const response = await fetch(`/forums/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "forum-id": id,
        },
        body: JSON.stringify({}),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to update like");
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["forums"] });

      if (data?.likes !== undefined) {
        setLikes(data.likes); // განახლებული ლაიქების რაოდენობა ბექიდან
        setIsLiked(!userLiked);
      } else {
        setLikes((prev) => (userLiked ? prev - 1 : prev + 1)); // თუ ბექი არ აბრუნებს ახალ რაოდენობას, ლოკალურად ვაახლებთ
        setIsLiked(!userLiked);
      }
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const handleLike = () => {
    if (!isAuthorized) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please login to like posts",
      });
      return;
    }
    likeMutation.mutate();
  };

  return (
    <div className="forum-post">
      <div className="forum-post-header">
        <div className="forum-post-author">
          <Image
            src={author.avatar}
            alt={`${author.name}'s avatar`}
            width={40}
            height={40}
            className="author-avatar"
          />
          <span className="author-name">{author.name}</span>
        </div>
        <span className="post-time">{time}</span>
      </div>
      <div className="forumSections">
        {image && (
          <Image
            src={image}
            alt="Forum post image"
            width={600}
            height={400}
            className="forum-post-image"
          />
        )}
        <div className="forumSection2">
          <p className="forum-post-text">{text}</p>

          <div className="forum-post-tags">
            {category.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>

          {isAuthorized && (
            <div className="comment-input-container">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="comment-input"
              />
              <button
                onClick={() => commentMutation.mutate()}
                disabled={!newComment.trim() || commentMutation.isPending}
                className="comment-button"
              >
                {commentMutation.isPending ? "Posting..." : "Post"}
              </button>
            </div>
          )}

          <div className="forum-post-actions">
            <button
              className={`like-button ${userLiked ? "liked" : ""}`}
              onClick={handleLike}
              disabled={!isAuthorized || likeMutation.isPending}
            >
              {likesCount} {userLiked ? "❤️" : "🤍"}
            </button>
          </div>

          <div className="comments-section">
            {comments.map((comment) => (
              <div key={comment.id} className="comment">
                <div className="comment-header">
                  <Image
                    src={comment.author.avatar}
                    alt={`${comment.author.name}'s avatar`}
                    width={32}
                    height={32}
                    className="comment-avatar"
                  />
                  <span className="comment-author">{comment.author.name}</span>
                </div>
                <p className="comment-text">{comment.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumPost;
