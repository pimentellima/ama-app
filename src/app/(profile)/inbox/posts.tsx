"use client";

import Reply from "@/components/reply";
import LoadMoreButton from "@/components/loadMoreButton";
import {
  EllipsisHorizontalIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/16/solid";
import moment from "moment";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import Popup from "reactjs-popup";
import { deletePost } from "./actions";
import { Answer, Question } from "@prisma/client";

function SettingsModal({
  questionId,
  onDeleteQuestion,
}: {
  questionId: number;
  onDeleteQuestion: (questionId: number) => void;
}) {
  const [open, setOpen] = useState<boolean>(false);

  const handleDeleteQuestion = async (questionId: number) => {
    try {
      await deletePost({ questionId });
      toast("Question deleted", {
        icon: "👏",
      });
      onDeleteQuestion(questionId);
    } catch (e) {
      return toast.error("Error deleting question");
    }
  };

  return (
    <Popup
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      arrow={false}
      trigger={
        <button>
          <EllipsisHorizontalIcon className="w-5 h-5" />
        </button>
      }
    >
      <div
        className="flex flex-col 
                rounded-md shadow-md bg-white dark:bg-stone-700 p-2"
      >
        <button
          onClick={async () => {
            setOpen(false);
            await handleDeleteQuestion(questionId);
          }}
          className="p-2 bg-white hover:bg-stone-300 
          dark:bg-stone-700 dark:hover:bg-stone-600 rounded-md"
        >
          Delete question
        </button>
      </div>
    </Popup>
  );
}

function CreateReply({
  question,
  onReplyPost: onReplyQuestion,
}: {
  onReplyPost: (post: any) => void;
  question: any;
}) {
  const [showReply, setShowReply] = useState<boolean>(false);
  const [replyBody, setReplyBody] = useState<string>("");

  async function postReply() {
    try {
      const res = await fetch("/api/replies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId: question.id,
          body: replyBody,
        }),
      });
      if (!res.ok) {
        return toast.error("Error sending reply");
      }
      const reply: Question & { answer: Answer } = await res.json();
      toast("Reply sent", {
        icon: "👏",
      });
      onReplyQuestion(reply);
      setReplyBody("");
    } catch (e) {
      toast.error("Error sending reply");
    }
  }

  return (
    <div className="grid grid-cols-[80%_1gr] mt-2">
      <Toaster position="top-center" />
      {showReply ? (
        <div className="flex flex-col p-1 bg-stone-200 dark:bg-stone-600 rounded-md ">
          <textarea
            maxLength={500}
            value={replyBody}
            onChange={(e) => setReplyBody(e.target.value)}
            placeholder="Type here..."
            className="w-full text-start placeholder:text-stone-400 bg-transparent
          resize-none p-2 h-16 focus:outline-none focus:ring-0"
          />
          <div className="flex justify-between">
            <p className="text-xs text-stone-400 p-2 bottom-0">{`${replyBody.length}/500`}</p>
            <button title="Send question" onClick={postReply}>
              <PaperAirplaneIcon className="h-7 w-7" />
            </button>
          </div>
        </div>
      ) : (
        <button
          className="text-center py-2 rounded-md 
          hover:bg-stone-300 dark:hover:bg-stone-600"
          onClick={() => setShowReply(true)}
        >
          Reply
        </button>
      )}
    </div>
  );
}

export default function ({ initialPosts }: { initialPosts: any[] }) {
  const [posts, setPosts] = useState<any[]>(initialPosts);
  const [loading, setLoading] = useState<"error" | "success" | "loading">(
    "success"
  );

  const onReplyPost = (post: Question) => {
    setPosts((posts) => {
      const newPosts = [...posts];
      const index = newPosts.findIndex((q) => q.id === post.id);
      if (index === -1) return posts;
      newPosts[index] = post;
      return newPosts;
    });
  };

  const onDeleteQuestion = (questionId: number) => {
    setPosts((questions) =>
      questions.filter((question) => question.id !== questionId)
    );
  };

  const handleLoadMore = async () => {
    setLoading("loading");
    try {
      const res = await fetch(`/api/posts/inbox?skip=${posts.length}`);
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
          <div className="flex justify-end pr-1">
            <SettingsModal
              onDeleteQuestion={onDeleteQuestion}
              questionId={question.id}
            />
          </div>
          <p className="break-words">{question.body}</p>
          <p className="text-xs text-stone-400">{`${moment(
            question.createdAt
          ).fromNow(true)} ago`}</p>
          {question.answer ? (
            <Reply answer={question.answer} />
          ) : (
            <CreateReply onReplyPost={onReplyPost} question={question} />
          )}
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
