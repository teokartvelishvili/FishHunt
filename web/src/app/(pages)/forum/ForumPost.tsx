"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/LanguageContext";
import "./ForumPost.css";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import imageCompression from "browser-image-compression";
import { apiClient } from "@/lib/api-client";
import { ThumbsUp, Share2, Edit2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Comment {
  id: string;
  text: string;
  author: {
    name: string;
    _id: string;
    avatar: string;
    profileImage?: string;
  };
  parentId?: string;
  replies?: string[];
  likes?: number;
  likesArray?: string[];
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
    profileImage?: string;
  };
  currentUser?: {
    _id: string;
    role: string;
    name?: string;
    profileImage?: string;
  };
  comments: Comment[];
  time: string;
  likes: number;
  isLiked: boolean;
  isAuthorized: boolean;
  canModify: boolean;
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
}: PostProps) => {
  const { t } = useLanguage();
  const router = useRouter();
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [editedPostText, setEditedPostText] = useState(text);
  const [editedPostImage, setEditedPostImage] = useState<File | null>(null);
  const [editedPostTags, setEditedPostTags] = useState<string[]>(category);
  const queryClient = useQueryClient();

  const [likesCount, setLikes] = useState(likes);
  const [userLiked, setIsLiked] = useState(isLiked);
  const [showComments, setShowComments] = useState(false);
  const [replyInputVisible, setReplyInputVisible] = useState<{
    [key: string]: boolean;
  }>({});
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});

  const [error, setError] = useState<string | null>(null);

  const isPostAuthor = currentUser?._id === author._id;
  const isAdmin = currentUser?.role === "admin";
  const canModifyPost = isPostAuthor || isAdmin;

  // Function to redirect to login with return URL
  const redirectToLogin = () => {
    const currentPath =
      typeof window !== "undefined" ? window.location.pathname : "/forum";
    router.push(`/login?returnUrl=${encodeURIComponent(currentPath)}`);
  };

  // Sync local state with props when they change
  useEffect(() => {
    setLikes(likes);
    setIsLiked(isLiked);
  }, [likes, isLiked]);

  // Check if this post is linked via URL (postId query parameter)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const postId = urlParams.get("postId");

      if (postId === id) {
        // Auto-expand comments for this post
        setShowComments(true);

        // Scroll to this post after a short delay
        setTimeout(() => {
          const element = document.getElementById(`forum-post-${id}`);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
            // Add a highlight effect
            element.style.backgroundColor = "rgba(165, 189, 165, 0.2)";
            setTimeout(() => {
              element.style.transition = "background-color 2s ease";
              element.style.backgroundColor = "";
            }, 1000);
          }
        }, 100);
      }
    }
  }, [id]);

  const replyMutation = useMutation({
    mutationFn: async ({
      commentId,
      content,
    }: {
      commentId: string;
      content: string;
    }) => {
      if (!isAuthorized || !currentUser) {
        throw new Error("You must be logged in to reply");
      }

      const response = await apiClient.post(
        `/forums/add-reply`,
        {
          commentId,
          content,
        },
        {
          headers: {
            "forum-id": id,
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      setReplyText({});
      setReplyInputVisible({});
      queryClient.invalidateQueries({ queryKey: ["forums"] });
      queryClient.invalidateQueries({ queryKey: ["homepageForums"] });
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
      const isConfirmed = window.confirm(
        "დარწმუნებული ხართ რომ გსურთ კომენტარის წაშლა?"
      );
      if (!isConfirmed) {
        throw new Error("Operation canceled by user");
      }

      const response = await apiClient.delete(
        `/forums/delete-comment/${commentId}`,
        {
          headers: {
            "forum-id": id,
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forums"] });
      queryClient.invalidateQueries({ queryKey: ["homepageForums"] });
      toast({
        title: "წარმატება",
        description: "კომენტარი წარმატებით წაიშალა",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "შეცდომა",
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
      console.log("Editing comment with data:", {
        commentId,
        content,
        currentUser,
        forumId: id,
      });

      const response = await apiClient.put(
        `/forums/edit-comment/${commentId}`,
        {
          content,
        },
        {
          headers: {
            "forum-id": id,
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      setEditingComment(null);
      setEditText("");
      queryClient.invalidateQueries({ queryKey: ["forums"] });
      queryClient.invalidateQueries({ queryKey: ["homepageForums"] });
      toast({
        title: "წარმატება",
        description: "კომენტარი წარმატებით განახლდა",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "შეცდომა",
        description: error.message,
      });
    },
  });

  const commentMutation = useMutation({
    mutationFn: async () => {
      if (!isAuthorized || !currentUser) {
        throw new Error("You must be logged in to comment");
      }

      const response = await apiClient.post(
        `/forums/add-comment`,
        {
          content: newComment,
        },
        {
          headers: {
            "forum-id": id,
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      setNewComment("");
      queryClient.invalidateQueries({ queryKey: ["forums"] });
      queryClient.invalidateQueries({ queryKey: ["homepageForums"] });
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
      if (!isAuthorized || !currentUser) {
        throw new Error("You must be logged in to like posts");
      }

      const endpoint = userLiked ? "remove-like" : "add-like";
      const response = await apiClient.post(
        `/forums/${endpoint}`,
        {},
        {
          headers: {
            "forum-id": id,
          },
        }
      );

      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["forums"] });
      queryClient.invalidateQueries({ queryKey: ["homepageForums"] });

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
      redirectToLogin();
      return;
    }
    likeMutation.mutate();
  };

  const handleShare = async () => {
    const postUrl = `${window.location.origin}/forum?postId=${id}`;
    const shareText = `${text.substring(0, 100)}${
      text.length > 100 ? "..." : ""
    }`;

    const shareData = {
      title: "Forum Post",
      text: shareText,
      url: postUrl,
    };

    try {
      // Check if Web Share API is supported
      if (navigator.share) {
        await navigator.share(shareData);
        toast({
          title: t("forum.shareSuccess") || "Success",
          description:
            t("forum.shareSuccessDesc") || "Post shared successfully",
        });
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(postUrl);
        toast({
          title: t("forum.linkCopied") || "Link Copied",
          description:
            t("forum.linkCopiedDesc") || "Post link copied to clipboard",
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
      // Fallback: Try to copy to clipboard
      try {
        await navigator.clipboard.writeText(postUrl);
        toast({
          title: t("forum.linkCopied") || "Link Copied",
          description:
            t("forum.linkCopiedDesc") || "Post link copied to clipboard",
        });
      } catch {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not share post",
        });
      }
    }
  };

  const validTags = ["fishing", "hunting", "camping", "all"];

  // Helper function to translate backend tags to current language
  const translateTag = (backendTag: string) => {
    // Map from backend tag values to translation keys
    const tagToKeyMap: Record<string, string> = {
      hunting: "forum.categories.hunting",
      fishing: "forum.categories.fishing",
      camping: "forum.categories.camping",
      all: "forum.categories.all",
    };

    // If we have a mapping for this tag, translate it; otherwise show as is
    const translationKey = tagToKeyMap[backendTag];
    return translationKey ? t(translationKey) : backendTag;
  };

  const editPostMutation = useMutation({
    mutationFn: async ({
      text,
      tags,
      image,
    }: {
      text: string;
      tags: string[];
      image: File | null;
    }) => {
      try {
        console.log("Attempting to edit post:", {
          postId: id,
          currentUserRole: currentUser?.role,
          isAdmin,
          isPostAuthor,
        });

        const formData = new FormData();
        formData.append("content", text);
        tags.forEach((tag, index) => {
          formData.append(`tags[${index}]`, tag);
        });
        if (image) {
          formData.append("file", image);
        }

        console.log("FormData before sending:", Array.from(formData.entries()));

        const response = await apiClient.put(`/forums/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        return response.data;
      } catch (error) {
        console.error("Edit post error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      setIsEditingPost(false);
      queryClient.invalidateQueries({ queryKey: ["forums"] });
      queryClient.invalidateQueries({ queryKey: ["homepageForums"] });
      toast({
        title: "წარმატება",
        description: "პოსტი წარმატებით განახლდა",
      });
      setError(null);
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "შეცდომა",
        description: error.message,
      });
      setError(error.message);
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: async () => {
      try {
        const isConfirmed = window.confirm(
          "დარწმუნებული ხართ რომ გსურთ პოსტის წაშლა?"
        );
        if (!isConfirmed) {
          throw new Error("Operation canceled by user");
        }

        console.log("Attempting to delete post:", {
          postId: id,
          currentUserRole: currentUser?.role,
          isAdmin,
          isPostAuthor,
        });

        const response = await apiClient.delete(`/forums/${id}`);
        return response.data;
      } catch (error) {
        console.error("Delete post error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forums"] });
      queryClient.invalidateQueries({ queryKey: ["homepageForums"] });
      toast({
        title: "წარმატება",
        description: "პოსტი წარმატებით წაიშალა",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "შეცდომა",
        description: error.message,
      });
    },
  });

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
    if (!isAuthorized) {
      redirectToLogin();
      return;
    }
    const content = replyText[commentId];
    if (!content?.trim()) return;

    replyMutation.mutate({ commentId, content });
  };

  const handleEditSubmit = (commentId: string) => {
    if (!editText.trim()) return;
    editCommentMutation.mutate({ commentId, content: editText });
  };

  const handlePostEdit = () => {
    if (!editedPostText.trim()) return;
    console.log("Editing post with data:", {
      postId: id,
      currentUser,
      author,
      isPostAuthor,
      canModifyPost,
      editedPostText,
      editedPostTags,
      editedPostImage,
    });
    editPostMutation.mutate({
      text: editedPostText,
      tags: editedPostTags,
      image: editedPostImage,
    });
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTag = e.target.value;
    if (newTag && !editedPostTags.includes(newTag)) {
      setEditedPostTags([...editedPostTags, newTag]);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditedPostTags(editedPostTags.filter((tag) => tag !== tagToRemove));
  };

  const handleEditedFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] || null;
    if (!file) {
      setEditedPostImage(null);
      return;
    }

    console.log("Selected file for edit:", {
      name: file.name,
      type: file.type,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
    });

    const supportedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image.heic",
      "image.heif",
    ];
    if (
      !supportedTypes.includes(file.type.toLowerCase()) &&
      !file.type.toLowerCase().startsWith("image/")
    ) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unsupported file type. Please upload an image file.",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "File size should not exceed 10MB",
      });
      return;
    }

    try {
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: "image/jpeg",
        alwaysKeepResolution: true,
        initialQuality: 0.8,
      });

      console.log("Compressed file for edit:", {
        type: compressedFile.type,
        size: `${(compressedFile.size / (1024 * 1024)).toFixed(2)} MB`,
      });

      setEditedPostImage(compressedFile);
    } catch (error) {
      console.error("Image compression error:", error);
      if (file.size <= 2 * 1024 * 1024) {
        setEditedPostImage(file);
        toast({
          title: "Information",
          description: "Using original image as compression failed",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to process the image. Please try another image.",
        });
      }
    }
  };

  const renderComment = (comment: Comment, level = 0) => {
    if (!comment || !comment.author) {
      return null;
    }

    const isCommentAuthor = currentUser?._id === comment.author._id;
    const canModifyComment = isCommentAuthor || isAdmin;

    return (
      <div
        key={comment.id}
        className="comment-item"
        style={{ marginLeft: `${level * 20}px` }}
      >
        <div className="comment-header">
          <Image
            src={
              comment.author.profileImage ||
              comment.author.avatar ||
              "/avatar.jpg"
            }
            alt={`${comment.author.name || "User"}'s avatar`}
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
            <button onClick={() => handleEditSubmit(comment.id)}>
              {t("forum.save")}
            </button>
            <button onClick={() => setEditingComment(null)}>
              {t("forum.cancel")}
            </button>
          </div>
        ) : (
          <>
            <p className="comment-text">{comment.text}</p>

            <div className="comment-actions">
              <button
                className="reply-button"
                onClick={() => {
                  if (!isAuthorized) {
                    redirectToLogin();
                    return;
                  }
                  toggleReplyInput(comment.id);
                }}
              >
                {t("forum.reply")}
              </button>
              {canModifyComment && (
                <>
                  <button
                    className="edit-button"
                    onClick={() => {
                      setEditingComment(comment.id);
                      setEditText(comment.text);
                    }}
                    aria-label={t("forum.edit")}
                  >
                    <span className="button-text">{t("forum.edit")}</span>
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => deleteCommentMutation.mutate(comment.id)}
                    aria-label={t("forum.delete")}
                  >
                    <span className="button-text">{t("forum.delete")}</span>
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
              placeholder={t("forum.writeReply")}
            />
            <button onClick={() => handleReplySubmit(comment.id)}>
              {t("forum.send")}
            </button>
          </div>
        )}

        {comments
          .filter((reply) => reply.parentId === comment.id)
          .map((reply) => renderComment(reply, level + 1))}
      </div>
    );
  };

  // Generate JSON-LD structured data for SEO
  const generateStructuredData = () => {
    const postUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/forum?postId=${id}`
        : "";

    return {
      "@context": "https://schema.org",
      "@type": "DiscussionForumPosting",
      headline: text.substring(0, 110),
      text: text,
      image: image || undefined,
      datePublished: time,
      author: {
        "@type": "Person",
        name: author.name,
        image: author.profileImage || author.avatar,
      },
      interactionStatistic: [
        {
          "@type": "InteractionCounter",
          interactionType: "https://schema.org/LikeAction",
          userInteractionCount: likesCount,
        },
        {
          "@type": "InteractionCounter",
          interactionType: "https://schema.org/CommentAction",
          userInteractionCount: comments.length,
        },
      ],
      url: postUrl,
      mainEntityOfPage: postUrl,
      keywords: category.join(", "),
      comment: comments.slice(0, 5).map((comment) => ({
        "@type": "Comment",
        text: comment.text,
        author: {
          "@type": "Person",
          name: comment.author.name,
        },
      })),
    };
  };

  return (
    <>
      {/* JSON-LD Structured Data for Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateStructuredData()),
        }}
      />

      <div className="forum-post" id={`forum-post-${id}`}>
        {image && (
          <Image
            src={image}
            alt={
              text ? `Forum post: ${text.substring(0, 50)}` : "Forum post image"
            }
            width={150}
            height={100}
            className="forum-post-image"
          />
        )}
        <div className="forum-post-content">
          <div className="forum-post-author">
            <Image
              src={author.profileImage || author.avatar || "/avatar.jpg"}
              alt={`${author.name || "User"}'s profile picture`}
              width={30}
              height={30}
              className="forum-post-avatar"
            />
            <span className="forum-post-author-name">{author.name}</span>
            <span className="forum-post-time">{time}</span>
            {isAuthorized && canModifyPost && (
              <div className="post-actions">
                <button
                  className="edit-button"
                  onClick={() => {
                    console.log(
                      "Edit button clicked, canModifyPost:",
                      canModifyPost
                    );
                    setIsEditingPost(true);
                  }}
                  aria-label={t("forum.edit")}
                >
                  <Edit2 size={16} className="button-icon" />
                  <span className="button-text">{t("forum.edit")}</span>
                </button>
                <button
                  className="delete-button"
                  onClick={() => {
                    console.log(
                      "Delete button clicked, canModifyPost:",
                      canModifyPost
                    );
                    deletePostMutation.mutate();
                  }}
                  aria-label={t("forum.delete")}
                >
                  <Trash2 size={16} className="button-icon" />
                  <span className="button-text">{t("forum.delete")}</span>
                </button>
              </div>
            )}
          </div>

          {isEditingPost ? (
            <div className="edit-post-section">
              <textarea
                value={editedPostText}
                onChange={(e) => setEditedPostText(e.target.value)}
                className="edit-post-input"
              />
              <div className="tags-input">
                <select
                  value=""
                  onChange={handleTagChange}
                  disabled={editedPostTags.length >= 3}
                >
                  <option value="" disabled>
                    {t("forum.selectCategory")}
                  </option>
                  {validTags.map((tag) => (
                    <option key={tag} value={tag}>
                      {translateTag(tag)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="tags-list">
                {editedPostTags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                    <button onClick={() => handleRemoveTag(tag)}>×</button>
                  </span>
                ))}
              </div>
              {editedPostImage ? (
                <div className="current-image">
                  <Image
                    src={URL.createObjectURL(editedPostImage)}
                    alt="New post image preview"
                    width={150}
                    height={100}
                  />
                </div>
              ) : (
                image && (
                  <div className="current-image">
                    <Image
                      src={image}
                      alt="Current post image"
                      width={150}
                      height={100}
                    />
                  </div>
                )
              )}
              <input
                type="file"
                onChange={handleEditedFileChange}
                accept="image/*"
                className="file-input"
              />
              {error && <div className="error-message">{error}</div>}
              <div className="edit-post-buttons">
                <button onClick={handlePostEdit}>{t("forum.save")}</button>
                <button
                  onClick={() => {
                    setIsEditingPost(false);
                    setEditedPostText(text);
                    setEditedPostTags(category);
                    setEditedPostImage(null);
                  }}
                >
                  {t("forum.cancel")}
                </button>
              </div>
            </div>
          ) : (
            <p className="forum-post-text">{text}</p>
          )}

          <div className="forum-post-footer">
            <div className="forum-post-left-section">
              <div className="forum-post-categories">
                {category.map((cat, index) => (
                  <span key={index} className="forum-post-category">
                    {translateTag(cat)}
                  </span>
                ))}
              </div>
              <span
                className="forum-post-comments"
                onClick={() => setShowComments(!showComments)}
              >
                💬 {t("forum.comments")} {comments.length}
              </span>
              <button
                className={`forum-post-favorite ${
                  userLiked ? "favorited" : ""
                }`}
                onClick={handleLike}
                disabled={likeMutation.isPending}
              >
                <ThumbsUp
                  size={16}
                  className={userLiked ? "liked-icon" : "like-icon"}
                />
                {likesCount}
              </button>
            </div>
            <button
              className="forum-post-share"
              onClick={handleShare}
              aria-label={t("forum.share") || "Share"}
            >
              <Share2 size={16} />
              <span className="share-text">{t("forum.share")}</span>
            </button>
          </div>

          {showComments && (
            <div className="forum-comments">
              {comments
                .filter((comment) => !comment.parentId)
                .map((comment) => renderComment(comment))}
            </div>
          )}

          <div className="main-comment-container">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onFocus={() => {
                if (!isAuthorized) {
                  redirectToLogin();
                }
              }}
              className="main-comment-input"
              placeholder={t("forum.writeComment")}
            />
            <button
              onClick={() => {
                if (!isAuthorized) {
                  redirectToLogin();
                  return;
                }
                commentMutation.mutate();
              }}
              disabled={!newComment.trim() || commentMutation.isPending}
            >
              {commentMutation.isPending ? t("forum.posting") : t("forum.send")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForumPost;
