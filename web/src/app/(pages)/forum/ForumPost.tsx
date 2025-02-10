"use client";
import Image, { StaticImageData } from "next/image";
import { useState } from "react";
import "./ForumPost.css";


interface Comment {
  id: number;
  text: string;
  author: {
    name: string;
    avatar: string; 
  };
  replies?: Comment[];
}

interface PostProps {
  id: number;
  image: string; 
  text: string;
  category: string[];
  author: {
    name: string;
    avatar: string; 
  };
  comments: Comment[];
  time: string;
}

const ForumPost = ({ id, image, text, category, author, comments, time }: PostProps) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
  const [showComments, setShowComments] = useState(false);
  
 
  const [replyInputVisible, setReplyInputVisible] = useState<{ [key: number]: boolean }>({});

  const [replyText, setReplyText] = useState<{ [key: number]: string }>({});

  const toggleReplyInput = (commentId: number) => {
    setReplyInputVisible((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  const handleReplyChange = (commentId: number, text: string) => {
    setReplyText((prev) => ({ ...prev, [commentId]: text }));
  };

  return (
    <div className="forum-post">
      <Image src={image} alt="post image" width={150} height={100} className="forum-post-image" />
      <div className="forum-post-content">
        <div className="forum-post-author">
          <Image src={author.avatar} alt={author.name} width={30} height={30} className="forum-post-avatar" />
          <span className="forum-post-author-name">{author.name}</span>
        </div>

        <p className="forum-post-text">
          {showFullText ? text : text.slice(0, 70)}
          {text.length > 90 && (
            <span className="forum-post-more" onClick={() => setShowFullText(!showFullText)}>
              {showFullText ? " Show less" : " ...Show more"}
            </span>
          )}
        </p>

        <div className="forum-post-footer">
          <div className="forum-post-categories">
            {category.map((cat, index) => (
            <span key={index} className="forum-post-category">{cat}</span>
            ))}
          </div>
          <span className="forum-post-time">{time}</span>
          <span className="forum-post-comments" onClick={() => setShowComments(!showComments)}>
            💬 {comments.length}
          </span>
          <button 
            className={`forum-post-favorite ${isFavorited ? "favorited" : ""}`}
            onClick={() => setIsFavorited(!isFavorited)}
          >
            {isFavorited ? "👍 1" : "👍🏻"}
          </button>
        </div>

        {showComments && (
          <div className="forum-comments">
            {comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <div className="comment-header">
                  <Image src={comment.author.avatar} alt={comment.author.name} width={25} height={25} className="comment-avatar" />
                  <span className="comment-author">{comment.author.name}</span>
                </div>
                <p className="comment-text">{comment.text}</p>
                
                {/* რეფლის ღილაკი */}
                <button className="reply-button" onClick={() => toggleReplyInput(comment.id)}>
                  Reply
                </button>

                {/* თუ ღილაკი დაჭერილია, გამოჩნდეს რეფლის ინფუთი */}
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

                {/* კომენტარის რეფლები */}
                {comment.replies?.map((reply) => (
                  <div key={reply.id} className="reply-item">
                    <div className="reply-header">
                      <Image src={reply.author.avatar} alt={reply.author.name} width={20} height={20} className="reply-avatar" />
                      <span className="reply-author">{reply.author.name}</span>
                    </div>
                    <p className="reply-text">{reply.text}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* მთავარი კომენტარის ინფუთი */}
        <div className="main-comment-container">
          <input type="text" className="main-comment-input" placeholder="Write a comment..." />
          <button>Send</button>
        </div>
      </div>
    </div>
  );
};

export default ForumPost;
