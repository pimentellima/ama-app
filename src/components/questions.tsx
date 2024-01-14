"use client";

import moment from "moment";
import Image from "next/image";
import CreateAnswer from "../app/(profile)/inbox/createAnswer";
import { useState } from "react";
import Link from "next/link";
import { ClipLoader } from "react-spinners";
import { EllipsisHorizontalIcon } from "@heroicons/react/16/solid";
import Popup from "reactjs-popup";
import toast, { Toaster } from "react-hot-toast";

function SettingsModal({
  questionId,
  onDeleteQuestion,
}: {
  questionId: string;
  onDeleteQuestion: (questionId: string) => void;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const handleDeleteQuestion = async (questionId: string) => {
    try {
      const res = await fetch(`/api/questions?questionId=${questionId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        return toast.error("Error deleting question");
      }
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
          onClick={() => {
            setOpen(false);
            handleDeleteQuestion(questionId);
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

export default function ({
  initialQuestions,
  userImageUrl,
  isCurrentUser,
  userUsername,
}: {
  initialQuestions: any[];
  isCurrentUser: boolean;
  userImageUrl: string;
  userUsername: string;
}) {
  const [questions, setQuestions] = useState<any[]>(initialQuestions);
  const [loading, setLoading] = useState<"error" | "success" | "loading">(
    "success"
  );

  const onReplyQuestion = (questionId: number, answer: any) => {
    setQuestions((questions) => {
      const newQuestions = [...questions];
      const index = newQuestions.findIndex((q) => q.id === questionId);
      if (index === -1) return questions;
      newQuestions[index].answer = answer;
      return newQuestions;
    });
  };

  const onDeleteQuestion = (questionId: string) => {
    setQuestions((questions) =>
      questions.filter((question) => question.id !== questionId)
    );
  };

  const handleLoadMore = async () => {
    setLoading("loading");
    try {
      const res = await fetch(
        `/api/questions/?username=${userUsername}&skip=${questions.length}`,
        {
          method: "GET",
        }
      );
      const newQuestions = await res.json();
      setQuestions([...questions, ...newQuestions]);
      setLoading("success");
    } catch (e) {
      setLoading("error");
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <Toaster position="top-center" />
      {questions.map((question, index) => (
        <div
          key={index}
          className="px-2 flex flex-col rounded-md 
          bg-white dark:bg-stone-700 shadow-sm py-2"
        >
          {isCurrentUser && (
            <div className="flex justify-end pr-1">
              <SettingsModal
                onDeleteQuestion={onDeleteQuestion}
                questionId={question.id}
              />
            </div>
          )}
          <p className="break-words">{question.body}</p>
          <p className="text-xs text-stone-400">{`${moment(
            question.createdAt
          ).fromNow(true)} ago`}</p>
          {question.answer ? (
            <div className="flex flex-col">
              <div className="flex mt-2">
                <Image
                  width={150}
                  height={150}
                  alt="user image"
                  src={userImageUrl}
                  className="rounded-full h-14 w-14"
                />
                <div className="ml-2 flex flex-col">
                  <Link href={`/${userUsername}`} className="hover:underline">
                    {userUsername}
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
          ) : (
            isCurrentUser && (
              <CreateAnswer
                onReplyQuestion={onReplyQuestion}
                question={question}
              />
            )
          )}
        </div>
      ))}
      <div className="flex justify-center">
        {loading === "loading" ? (
          <ClipLoader color="white" className="h-6 w-6" />
        ) : (
          <button
            onClick={handleLoadMore}
            className="hover:bg-stone-300 dark:hover:bg-stone-600 bg-white dark:bg-stone-700 py-2 px-4 rounded-full"
          >
            {loading === "success" && "Load more"}
            {loading === "error" && "Error while loading. Try again"}
          </button>
        )}
      </div>
    </div>
  );
}
