"use client";

import { useState } from "react";
import CreateAnswer from "./createAnswer";
import ShareToTwitter from "./shareToTwitter";
import moment from "moment";

export default function ({
  initialQuestions,
  pageUserUsername,
  isCurrentUserPage,
}: {
  initialQuestions: any[];
  pageUserUsername: string;
  isCurrentUserPage: boolean;
}) {
  const [questions, setQuestions] = useState<any[]>(initialQuestions);
  const [loading, setLoading] = useState<"error" | "success" | "loading">(
    "success"
  );

  const handleLoadMore = async () => {
    setLoading("loading");
    try {
      const res = await fetch(
        `/api/questions?username=${pageUserUsername}&skip=${questions.length}`,
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
    <div className=" flex flex-col gap-2">
      {questions.length === 0 ? (
        <span>No questions</span>
      ) : (
        questions.map((question, index) => (
          <div
            key={index}
            className="px-2 flex flex-col bg-stone-800 rounded-sm py-2"
          >
            <p className="break-words">{question.body}</p>
            <p className="text-xs text-stone-400">{`Anon · ${moment(
              question.createdAt
            ).fromNow(true)} ago`}</p>
            {question.answer && (
              <div className="flex flex-col">
                <div className="flex mt-2">
                  <div
                    className="rounded-full bg-stone-400 flex
                       items-center justify-center text-xs h-14 w-14"
                  >
                    Avatar
                  </div>
                  <div className="ml-2 flex flex-col">
                    <div className="">{pageUserUsername}</div>
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
            {!question.answer && isCurrentUserPage && (
              <CreateAnswer username={pageUserUsername} question={question} />
            )}
            {!!question.answer && isCurrentUserPage && (
              <ShareToTwitter
                username={pageUserUsername}
                text={`${question.body}\n——${question.answer.body}\n\n`}
              />
            )}
          </div>
        ))
      )}
      <button className="hover:bg-stone-600" onClick={handleLoadMore}>
        {loading === "loading" && "Loading..."}
        {loading === "success" && "Load more"}
        {loading === "error" && "Error while loading. Try again"}
      </button>
    </div>
  );
}
