"use client";

import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { ClipLoader } from "react-spinners";

export default function ({ initialPosts }: { initialPosts: any[] }) {
  const [posts, setInitialPosts] = useState<any[]>(initialPosts);
  const [loading, setLoading] = useState<"error" | "success" | "loading">(
    "success"
  );

  const handleLoadMore = async () => {
    setLoading("loading");
    try {
      const res = await fetch(`/api/questions/feed?skip=${posts.length}`, {
        method: "GET",
      });
      const newPosts = await res.json();
      setInitialPosts([...posts, ...newPosts]);
      setLoading("success");
    } catch (e) {
      setLoading("error");
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <Toaster position="top-center" />
      {posts.map((question, index) => (
        <div
          key={index}
          className="px-2 flex flex-col rounded-md 
          bg-white dark:bg-stone-700 shadow-sm py-2"
        >
          <p className="break-words">{question.body}</p>
          <p className="text-xs text-stone-400">{`${moment(
            question.createdAt
          ).fromNow(true)} ago`}</p>
          {question.answer && (
            <div className="flex flex-col">
              <div className="flex mt-2">
                <Image
                  width={150}
                  height={150}
                  alt="user image"
                  src={question.answer.user.imageUrl}
                  className="rounded-full h-14 w-14"
                />
                <div className="ml-2 flex flex-col">
                  <Link
                    href={`/${question.answer.user.username}`}
                    className="hover:underline"
                  >
                    {question.answer.user.username}
                  </Link>
                  <p className="text-xs text-stone-400">{`${moment(
                    question.answer.createdAt
                  ).fromNow(true)} ago`}</p>
                </div>
              </div>
              <div className="flex border-stone-700 px-2 py-1 mt-2">
                {question.answer.body}
              </div>
            </div>
          )}
        </div>
      ))}
      <div className="flex justify-center">
        {loading === "loading" ? (
          <ClipLoader color="white" className="h-6 w-6" />
        ) : (
          <button
            onClick={handleLoadMore}
            className="hover:bg-stone-300 dark:hover:bg-stone-600
             bg-white dark:bg-stone-700 py-2 px-4 rounded-full"
          >
            {loading === "success" && "Load more"}
            {loading === "error" && "Error while loading. Try again"}
          </button>
        )}
      </div>
    </div>
  );
}
