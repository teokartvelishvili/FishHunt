"use client";
import { useState, useEffect } from "react";
import ForumPost from "./ForumPost";
import "./ForumPage.css";
import noPhoto from "../../../assets/nophoto.webp";

const ForumPage = ({ limit }: { limit?: number | null }) => {
    const allPosts = [
      {
        id: 1,
        image: noPhoto.src,
        text: "ყველაზე თავგადასავლიანი სეზონი იწყება! ყველაზე თავგადასავლიანი სეზონი იწყება! ყველაზე თავგადასავლიანი სეზონი იწყება! ყველაზე თავგადასავლიანი სეზონი იწყება! ყველაზე თავგადასავლიანი სეზონი იწყება! ყველაზე თავგადასავლიანი სეზონი იწყება!",
        category: ["Fishing", "Camping"],
        author: { name: "ნიკა ჯაფარიძე", avatar: noPhoto.src },
        comments: [
          {
            id: 1,
            text: "ძალიან საინტერესო პოსტია!",
            author: { name: "გიორგი ცინცაძე", avatar: noPhoto.src },
            replies: [
              {
                id: 2,
                text: "მართალი ხარ, მეც ვეთანხმები!",
                author: { name: "მარიამ კალანდაძე", avatar: noPhoto.src }
              }
            ]
          },
          {
            id: 3,
            text: "რა ადგილებია საუკეთესო თევზაობისთვის?",
            author: { name: "დავით ჩაჩანიძე", avatar: noPhoto.src },
            replies: []
          }
        ],
        time: "3 hours ago",
      },
      {
        id: 2,
        image: noPhoto.src,
        text: "ნადირობის სეზონი უკვე დაიწყო!",
        category: ["Hunting"],
        author: { name: "მარიამ კალანდაძე", avatar: noPhoto.src },
        comments: [
          {
            id: 4,
            text: "მშვენიერი დროა ნადირობისთვის!",
            author: { name: "ლაშა კობახიძე", avatar: noPhoto.src },
            replies: [
              {
                id: 5,
                text: "აბსოლუტურად გეთანხმები!",
                author: { name: "სანდრო ქურდაძე", avatar: noPhoto.src }
              }
            ]
          }
        ],
        time: "5 hours ago",
      },
      {
        id: 3,
        image: noPhoto.src,
        text: "ყველაზე თავგადასავლიანი სეზონი იწყება! ყველაზე თავგადასავლიანი სეზონი იწყება! ყველაზე თავგადასავლიანი სეზონი იწყება! ყველაზე თავგადასავლიანი სეზონი იწყება! ყველაზე თავგადასავლიანი სეზონი იწყება! ყველაზე თავგადასავლიანი სეზონი იწყება!",
        category: ["Fishing", "Camping"],
        author: { name: "ნიკა ჯაფარიძე", avatar: noPhoto.src },
        comments: [
          {
            id: 1,
            text: "ძალიან საინტერესო პოსტია!",
            author: { name: "გიორგი ცინცაძე", avatar: noPhoto.src },
            replies: [
              {
                id: 2,
                text: "მართალი ხარ, მეც ვეთანხმები!",
                author: { name: "მარიამ კალანდაძე", avatar: noPhoto.src }
              }
            ]
          },
          {
            id: 3,
            text: "რა ადგილებია საუკეთესო თევზაობისთვის?",
            author: { name: "დავით ჩაჩანიძე", avatar: noPhoto.src },
            replies: []
          }
        ],
        time: "3 hours ago",
      },
      {
        id: 4,
        image: noPhoto.src,
        text: "ნადირობის სეზონი უკვე დაიწყო!",
        category: ["Hunting"],
        author: { name: "მარიამ კალანდაძე", avatar: noPhoto.src },
        comments: [
          {
            id: 4,
            text: "მშვენიერი დროა ნადირობისთვის!",
            author: { name: "ლაშა კობახიძე", avatar: noPhoto.src },
            replies: [
              {
                id: 5,
                text: "აბსოლუტურად გეთანხმები!",
                author: { name: "სანდრო ქურდაძე", avatar: noPhoto.src }
              }
            ]
          }
        ],
        time: "5 hours ago",
      },
      {
        id: 5,
        image: noPhoto.src,
        text: "ყველაზე თავგადასავლიანი სეზონი იწყება! ყველაზე თავგადასავლიანი სეზონი იწყება! ყველაზე თავგადასავლიანი სეზონი იწყება! ყველაზე თავგადასავლიანი სეზონი იწყება! ყველაზე თავგადასავლიანი სეზონი იწყება! ყველაზე თავგადასავლიანი სეზონი იწყება!",
        category: ["Fishing"],
        author: { name: "ნიკა ჯაფარიძე", avatar: noPhoto.src },
        comments: [
          {
            id: 1,
            text: "ძალიან საინტერესო პოსტია!",
            author: { name: "გიორგი ცინცაძე", avatar: noPhoto.src },
            replies: [
              {
                id: 2,
                text: "მართალი ხარ, მეც ვეთანხმები!",
                author: { name: "მარიამ კალანდაძე", avatar: noPhoto.src }
              }
            ]
          },
          {
            id: 3,
            text: "რა ადგილებია საუკეთესო თევზაობისთვის?",
            author: { name: "დავით ჩაჩანიძე", avatar: noPhoto.src },
            replies: []
          }
        ],
        time: "3 hours ago",
      },
      {
        id: 6,
        image: noPhoto.src,
        text: "ნადირობის სეზონი უკვე დაიწყო!",
        category: ["Hunting", "Camping"],
        author: { name: "მარიამ კალანდაძე", avatar: noPhoto.src },
        comments: [
          {
            id: 4,
            text: "მშვენიერი დროა ნადირობისთვის!",
            author: { name: "ლაშა კობახიძე", avatar: noPhoto.src },
            replies: [
              {
                id: 5,
                text: "აბსოლუტურად გეთანხმები!",
                author: { name: "სანდრო ქურდაძე", avatar: noPhoto.src }
              }
            ]
          }
        ],
        time: "5 hours ago",
      },
      {
        id: 7,
        image: noPhoto.src,
        text: "ყველაზე თავგადასავლიანი სეზონი იწყება! ყველაზე თავგადასავლიანი სეზონი იწყება! ყველაზე თავგადასავლიანი სეზონი იწყება! ყველაზე თავგადასავლიანი სეზონი იწყება! ყველაზე თავგადასავლიანი სეზონი იწყება! ყველაზე თავგადასავლიანი სეზონი იწყება!",
        category: ["Fishing"],
        author: { name: "ნიკა ჯაფარიძე", avatar: noPhoto.src },
        comments: [
          {
            id: 1,
            text: "ძალიან საინტერესო პოსტია!",
            author: { name: "გიორგი ცინცაძე", avatar: noPhoto.src },
            replies: [
              {
                id: 2,
                text: "მართალი ხარ, მეც ვეთანხმები!",
                author: { name: "მარიამ კალანდაძე", avatar: noPhoto.src }
              }
            ]
          },
          {
            id: 3,
            text: "რა ადგილებია საუკეთესო თევზაობისთვის?",
            author: { name: "დავით ჩაჩანიძე", avatar: noPhoto.src },
            replies: []
          }
        ],
        time: "3 hours ago",
      },
      {
        id: 8,
        image: noPhoto.src,
        text: "ნადირობის სეზონი უკვე დაიწყო!",
        category: ["Hunting"],
        author: { name: "მარიამ კალანდაძე", avatar: noPhoto.src },
        comments: [
          {
            id: 4,
            text: "მშვენიერი დროა ნადირობისთვის!",
            author: { name: "ლაშა კობახიძე", avatar: noPhoto.src },
            replies: [
              {
                id: 5,
                text: "აბსოლუტურად გეთანხმები!",
                author: { name: "სანდრო ქურდაძე", avatar: noPhoto.src }
              }
            ]
          }
        ],
        time: "5 hours ago",
      }
    ];
    

  const [visiblePosts, setVisiblePosts] = useState(
    limit ? allPosts.slice(0, limit) : allPosts.slice(0, 5)
  );

  useEffect(() => {
    if (limit) return;

    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100
      ) {
        setVisiblePosts((prev) =>
          allPosts.length > prev.length ? allPosts.slice(0, prev.length + 2) : prev
        );
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visiblePosts, limit]);

  return (
    <div className="forum-page">
      {visiblePosts.map((post) => (
        <ForumPost key={post.id} {...post} />
      ))}
    </div>
  );
};

export default ForumPage;
