"use client";

import moment from "moment";
import Image from "next/image";
import CreateAnswer from "./createAnswer";
import { useState } from "react";

export default function ({
  initialQuestions,
  userImageUrl,
  userUsername,
}: {
  initialQuestions: any[];
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

  const handleLoadMore = async () => {
    setLoading("loading");
    try {
      const res = await fetch(
        `/api/questions?username=${userUsername}&skip=${questions.length}`,
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
      {questions.map((question, index) => (
        <div
          key={index}
          className="px-2 flex flex-col rounded-md bg-stone-700 shadow-sm py-2"
        >
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
                  <div className="">{userUsername}</div>
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
            <CreateAnswer
              onReplyQuestion={onReplyQuestion}
              question={question}
            />
          )}
        </div>
      ))}
      <div className="flex justify-center">
        <button
          onClick={handleLoadMore}
          className="hover:bg-stone-600 bg-stone-700 py-2 px-4 rounded-full"
        >
          {loading === "loading" && "Loading..."}
          {loading === "success" && "Load more"}
          {loading === "error" && "Error while loading. Try again"}
        </button>
      </div>
    </div>
  );
}
