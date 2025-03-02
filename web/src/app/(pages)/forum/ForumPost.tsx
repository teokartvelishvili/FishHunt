"use client";

import { JSX, useState } from "react";
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
    _id: string;
    avatar: string;
  };
  parentId?: string;
  replies?: string[];
}

interface PostProps {
  id: string;
  image: string;
  text: string;
  category: string[];
  author: {
    name: string;
    _id: string;
    avatar: string;
    role: string;
  };
  currentUser?: {
    _id: string;
    role: string;
  };
  comments: Comment[];
  time: string;
  likes: number;
  isLiked: boolean;
  isAuthorized: boolean;
  deleteButton?: JSX.Element | null;
}

const ForumPost = ({
  id,
  image,
  text,
  category,
  author,
  currentUser,
  comments,
  time,
  likes,
  isLiked,
  isAuthorized,
  deleteButton,
}: PostProps) => {
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const queryClient = useQueryClient();

  const [likesCount, setLikes] = useState(likes);
  const [userLiked, setIsLiked] = useState(isLiked);
  const [showComments, setShowComments] = useState(false);
  const [replyInputVisible, setReplyInputVisible] = useState<{
    [key: string]: boolean;
  }>({});
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});

  const replyMutation = useMutation({
    mutationFn: async ({
      commentId,
      content,
    }: {
      commentId: string;
      content: string;
    }) => {
      const response = await fetchWithAuth(`/forums/add-reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "forum-id": id,
        },
        body: JSON.stringify({
          commentId,
          content,
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to add reply");
      }
      return response.json();
    },
    onSuccess: () => {
      setReplyText({});
      setReplyInputVisible({});
      queryClient.invalidateQueries({ queryKey: ["forums"] });
      toast({
        title: "Success",
        description: "Reply added successfully",
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

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const response = await fetchWithAuth(
        `/forums/delete-comment/${commentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "forum-id": id,
          },
        }
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete comment");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forums"] });
      toast({
        title: "Success",
        description: "Comment deleted successfully",
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

  const editCommentMutation = useMutation({
    mutationFn: async ({
      commentId,
      content,
    }: {
      commentId: string;
      content: string;
    }) => {
      const response = await fetchWithAuth(
        `/forums/edit-comment/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "forum-id": id,
          },
          body: JSON.stringify({
            content,
          }),
        }
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to edit comment");
      }
      return response.json();
    },
    onSuccess: () => {
      setEditingComment(null);
      setEditText("");
      queryClient.invalidateQueries({ queryKey: ["forums"] });
      toast({
        title: "Success",
        description: "Comment edited successfully",
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
        setLikes(data.likes);
        setIsLiked(!userLiked);
      } else {
        setLikes((prev) => (userLiked ? prev - 1 : prev + 1));
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

  const handleReplySubmit = (commentId: string) => {
    const content = replyText[commentId];
    if (!content?.trim()) return;

    replyMutation.mutate({ commentId, content });
  };

  const handleEditSubmit = (commentId: string) => {
    if (!editText.trim()) return;
    editCommentMutation.mutate({ commentId, content: editText });
  };

  const renderComment = (comment: Comment, level = 0) => {
    const isAuthor = currentUser?._id === comment.author._id;
    const isAdmin = currentUser?.role === "admin";
    const canModify = isAuthor || isAdmin;

    return (
      <div
        key={comment.id}
        className="comment-item"
        style={{ marginLeft: `${level * 20}px` }}
      >
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

        {editingComment === comment.id ? (
          <div className="edit-comment-section">
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="edit-comment-input"
            />
            <button onClick={() => handleEditSubmit(comment.id)}>Save</button>
            <button onClick={() => setEditingComment(null)}>Cancel</button>
          </div>
        ) : (
          <>
            <p className="comment-text">{comment.text}</p>

            <div className="comment-actions">
              {isAuthorized && (
                <button
                  className="reply-button"
                  onClick={() => toggleReplyInput(comment.id)}
                >
                  Reply
                </button>
              )}
              {canModify && (
                <>
                  <button
                    className="edit-button"
                    onClick={() => {
                      setEditingComment(comment.id);
                      setEditText(comment.text);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => deleteCommentMutation.mutate(comment.id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </>
        )}

        {replyInputVisible[comment.id] && (
          <div className="reply-section">
            <input
              type="text"
              value={replyText[comment.id] || ""}
              onChange={(e) => handleReplyChange(comment.id, e.target.value)}
              placeholder="Write a reply..."
            />
            <button onClick={() => handleReplySubmit(comment.id)}>Send</button>
          </div>
        )}

        {/* Render replies */}
        {comments
          .filter((reply) => reply.parentId === comment.id)
          .map((reply) => renderComment(reply, level + 1))}
      </div>
    );
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
            {comments
              .filter((comment) => !comment.parentId)
              .map((comment) => renderComment(comment))}
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
      {deleteButton}
    </div>
  );
};

export default ForumPost;
