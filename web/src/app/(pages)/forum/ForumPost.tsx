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
  const [showComments, setShowComments] = useState(false);
  const [replyInputVisible, setReplyInputVisible] = useState<{[key: string]: boolean}>({});
  const [replyText, setReplyText] = useState<{[key: string]: string}>({});

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
      const response = await fetchWithAuth(`/forums/${endpoint}`, {
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

  const toggleReplyInput = (commentId: string) => {
    setReplyInputVisible((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleReplyChange = (commentId: string, text: string) => {
    setReplyText((prev) => ({ ...prev, [commentId]: text }));
  };

  return (
    <div className="forum-post">
      <Image
        src={image}
        alt="post image"
        width={150}
        height={100}
        className="forum-post-image"
      />
      <div className="forum-post-content">
        <div className="forum-post-author">
          <Image
            src={author.avatar}
            alt={`${author.name}'s avatar`}
            width={30}
            height={30}
            className="forum-post-avatar"
          />
          <span className="forum-post-author-name">{author.name}</span>
        </div>

        <p className="forum-post-text">{text}</p>

        <div className="forum-post-footer">
          <div className="forum-post-categories">
            {category.map((cat, index) => (
              <span key={index} className="forum-post-category">
                {cat}
              </span>
            ))}
          </div>
          <span className="forum-post-time">{time}</span>
          <span
            className="forum-post-comments"
            onClick={() => setShowComments(!showComments)}
          >
            💬 {comments.length}
          </span>
          <button
            className={`forum-post-favorite ${userLiked ? "favorited" : ""}`}
            onClick={handleLike}
            disabled={!isAuthorized || likeMutation.isPending}
          >
            {likesCount} {userLiked ? "👍" : "👍🏻"}
          </button>
        </div>

        {showComments && (
          <div className="forum-comments">
            {comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <div className="comment-header">
                  <Image
                    src={comment.author.avatar}
                    alt={comment.author.name}
                    width={25}
                    height={25}
                    className="comment-avatar"
                  />
                  <span className="comment-author">{comment.author.name}</span>
                </div>
                <p className="comment-text">{comment.text}</p>

                <button
                  className="reply-button"
                  onClick={() => toggleReplyInput(comment.id)}
                >
                  Reply
                </button>

                {replyInputVisible[comment.id] && (
                  <div className="reply-section">
                    <input
                      type="text"
                      value={replyText[comment.id] || ""}
                      onChange={(e) => handleReplyChange(comment.id, e.target.value)}
                      placeholder="Write a reply..."
                    />
                    <button>Send</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {isAuthorized && (
          <div className="main-comment-container">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="main-comment-input"
              placeholder="Write a comment..."
            />
            <button
              onClick={() => commentMutation.mutate()}
              disabled={!newComment.trim() || commentMutation.isPending}
            >
              {commentMutation.isPending ? "Posting..." : "Send"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForumPost;
