"use client";
import { useState, useEffect } from "react";
import ForumPost from "./ForumPost";
import "./ForumPage.css";
import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/fetch-with-auth";
import CreateForumModal from "./CreateForumModal";
import { useUser } from "@/modules/auth/hooks/use-user";
import Loading from "../admin/users/loading";
import LoadingAnim from "@/components/loadingAnim/loadingAnim";

interface Forum {
  _id: string;
  content: string;
  user: {
    name: string;
    _id: string;
    role: string;
  };
  tags: string[];
  comments: Array<{
    _id: string;
    content: string;
    user: {
      name: string;
      _id: string;
    };
    createdAt: string;
    parentId?: string;
    replies?: string[];
  }>;
  likes: number;
  likesArray: string[];
  image: string;
  createdAt: string;
}

const ForumPage = () => {
  const [page, setPage] = useState(1);
  const { user, isLoading: isUserLoading } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [forums, setForums] = useState<Forum[]>([]);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // დავლოგოთ მომხმარებლის მონაცემები
  console.log("User from useUser:", user);

  const { data: newForums, isLoading: isForumsLoading } = useQuery({
    queryKey: ["forums", page],
    queryFn: async () => {
      const response = await fetchWithAuth(`/forums?page=${page}&take=20`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      console.log("Raw forum data from API:", data);
      return data as Forum[];
    },
  });

  useEffect(() => {
    if (newForums) {
      setForums((prevForums) => [...prevForums, ...newForums]);
      setIsFetchingMore(false);
      if (newForums.length < 20) {
        setHasMore(false);
      }
    }
  }, [newForums]);

  // დავლოგოთ მომხმარებლის მონაცემები დეტალურად
  console.log("User loading:", isUserLoading);
  console.log("Forums loading:", isForumsLoading);
  console.log("User details:", {
    id: user?._id,
    role: user?.role,
    name: user?.name,
  });

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop !==
          document.documentElement.offsetHeight ||
        isFetchingMore ||
        !hasMore
      )
        return;
      setIsFetchingMore(true);
      setPage((prevPage) => prevPage + 1);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFetchingMore, hasMore]);

  if (isUserLoading || isForumsLoading) {
    return <div> <LoadingAnim/> </div>;
  }

  // დავლოგოთ ფორუმები დეტალურად
  console.log(
    "Forums data detailed:",
    forums?.map((forum) => ({
      id: forum._id,
      authorId: forum.user._id,
      authorName: forum.user.name,
      authorRole: forum.user.role,
      content: forum.content,
    }))
  );

  return (
    <div className="forum-page">
      {isUserLoading || isForumsLoading ? (
        // <div>იტვირთება...</div>
        <div> <Loading/> </div>
      ) : (
        <>
          {user && (
            <button
              className="create-post-button"
              onClick={() => setIsModalOpen(true)}
            >
              ➕ ახალი პოსტის დამატება
            </button>
          )}

          <CreateForumModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />

          {forums?.map((forum: Forum) => {
            const isOwner = user?._id === forum.user._id;
            const isAdmin = user?.role === "admin";
            const canModify = isOwner || isAdmin;

            // დავლოგოთ თითოეული პოსტის უფლებები
            console.log("Forum:", forum._id);
            console.log("Forum Author:", forum.user._id);
            console.log("Current User ID:", user?._id);
            console.log("Is Owner:", isOwner);
            console.log("Is Admin:", isAdmin);
            console.log("Can Modify:", canModify);

            return (
              <ForumPost
                key={forum._id}
                id={forum._id}
                image={forum.image || "/avatar.jpg"}
                text={forum.content}
                category={forum.tags}
                author={{
                  name: forum.user.name,
                  _id: forum.user._id,
                  avatar: "/avatar.jpg",
                  role: forum.user.role,
                }}
                currentUser={
                  user
                    ? {
                        _id: user._id,
                        role: user.role,
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
                  },
                  parentId: comment.parentId?.toString(),
                  replies: comment.replies?.map((r) => r.toString()),
                }))}
                time={new Date(forum.createdAt).toLocaleDateString()}
                likes={forum.likes}
                isLiked={forum.likesArray.includes(user?._id || "")}
                isAuthorized={!!user}
              />
            );
          })}
        </>
      )}
    </div>
  );
};

export default ForumPage;
