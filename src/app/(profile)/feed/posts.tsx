"use client";

import Reply from "@/components/reply";
import LoadMoreButton from "@/components/loadMoreButton";
import moment from "moment";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import Link from "next/link";

export default function ({ initialPosts }: { initialPosts: any[] }) {
  const [posts, setPosts] = useState<any[]>(initialPosts);
  const [loading, setLoading] = useState<"error" | "success" | "loading">(
    "success"
  );

  const handleLoadMore = async () => {
    setLoading("loading");
    try {
      const res = await fetch(`/api/posts/feed?skip=${posts.length}`);

      if (!res.ok) {
        setLoading("error");
      }
      const newPosts = await res.json();
      setPosts([...posts, ...newPosts]);
      setLoading("success");
    } catch (e) {
      setLoading("error");
    }
  };

  if (posts.length === 0)
    return (
      <div className="flex flex-col text-center">
        <p>No posts to show</p>
        <Link
          className="text-lg font-semibold hover:underline"
          href={"/search"}
        >
          Find people to follow
        </Link>
      </div>
    );

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
          {question.answer && <Reply answer={question.answer} />}
        </div>
      ))}
      <div className="flex justify-center">
        {loading === "loading" ? (
          <ClipLoader color="white" className="h-6 w-6" />
        ) : (
          <LoadMoreButton loading={loading} handleLoadMore={handleLoadMore} />
        )}
      </div>
    </div>
  );
}
