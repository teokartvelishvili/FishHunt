"use client";
import Link from "next/link";
import "./homePageForum.css";
import { useState } from "react";
import ForumPost from "@/app/(pages)/forum/ForumPost";
import Pattern from "@/components/pattern/pattern";
import { useLanguage } from "@/hooks/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import CreateForumModal from "@/app/(pages)/forum/CreateForumModal";
import { useUser } from "@/modules/auth/hooks/use-user";

interface Forum {
  _id: string;
  content: string;
  user: {
    name: string;
    _id: string;
    role: string;
    profileImage?: string;
  };
  tags: string[];
  comments: Array<{
    _id: string;
    content: string;
    user: {
      name: string;
      _id: string;
      profileImage?: string;
    };
    createdAt: string;
    parentId?: string;
    replies?: string[];
    likes?: number;
    likesArray?: string[];
  }>;
  likes: number;
  likesArray: string[];
  image: string;
  createdAt: string;
}

const HomePageForum = () => {
  const { t } = useLanguage();
  const { user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: forums, isLoading } = useQuery({
    queryKey: ["homepageForums"],
    queryFn: async () => {
      const response = await apiClient.get("/forums", {
        params: { page: 1, take: 3 },
      });
      return response.data as Forum[];
    },
  });

  return (
    <div className="homePageForum">
      <Pattern imageSize={350} />
      <div className="homepage-forum-header">
        <h1 className="homePageForumH1">{t("navbar.forum")}</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="add-post-button-home"
        >
          {t("forum.addNewPost")}
        </button>
      </div>

      {isLoading ? (
        <p>{t("forum.loadingMore")}</p>
      ) : (
        forums?.map((forum) => {
          const isOwner = user?._id === forum.user._id;
          const isAdmin = user?.role === "admin";
          const canModify = isOwner || isAdmin;
          const isLiked = user?._id ? forum.likesArray?.includes(user._id) : false;

          return (
            <ForumPost
              key={forum._id}
              id={forum._id}
              image={forum.image}
              text={forum.content}
              category={forum.tags}
              author={{
                name: forum.user.name,
                _id: forum.user._id,
                avatar: "/avatar.jpg",
                profileImage: forum.user.profileImage,
                role: forum.user.role,
              }}
              currentUser={
                user
                  ? {
                      _id: user._id,
                      role: user.role,
                      name: user.name,
                      profileImage: user.profileImage,
                    }
                  : undefined
              }
              comments={forum.comments.map((comment) => ({
                id: comment._id,
                text: comment.content,
                author: {
                  name: comment.user.name,
                  _id: comment.user._id,
                  avatar: "/avatar.jpg",
                  profileImage: comment.user.profileImage || undefined,
                },
                parentId: comment.parentId?.toString(),
                replies: comment.replies?.map((r) => r.toString()),
                likes: comment.likes || 0,
                likesArray: comment.likesArray || [],
              }))}
              time={new Date(forum.createdAt).toLocaleDateString()}
              likes={forum.likes}
              isLiked={isLiked}
              isAuthorized={!!user}
              canModify={canModify}
            />
          );
        })
      )}

      <Link href="/forum" className="forumPageLink">
        {t("forum.viewAllPosts")}
      </Link>

      <CreateForumModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default HomePageForum;