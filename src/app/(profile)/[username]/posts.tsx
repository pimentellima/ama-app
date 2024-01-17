"use client";

import Reply from "@/components/reply";
import LoadMoreButton from "@/components/loadMoreButton";
import moment from "moment";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { useParams, useSearchParams } from "next/navigation";

export default function ({ initialPosts }: { initialPosts: any[] }) {
  const [posts, setPosts] = useState<any[]>(initialPosts);
  const [loading, setLoading] = useState<"error" | "success" | "loading">(
    "success"
  );
  const { username } = useParams();

  const handleLoadMore = async () => {
    setLoading("loading");
    try {
      const res = await fetch(
        `/api/posts/profile?username=${username}&skip=${posts.length}`
      );
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
