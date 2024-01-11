"use client";

import { useState } from "react";
import CreateAnswer from "./createAnswer";
import ShareToTwitter from "./shareToTwitter";
import moment from "moment";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import CreateQuestion from "./createQuestion";

export default function ({
  initialQuestions,
  pageUserUsername,
  pageUserProfilePic,
  questionsCount,
  isCurrentUserPage,
}: {
  initialQuestions: any[];
  pageUserUsername: string;
  questionsCount: number;
  pageUserProfilePic: string;
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
    <>
      <CreateQuestion setQuestions={setQuestions} username={pageUserUsername} />
      <div className=" flex flex-col gap-2">
        {questions.length === 0 ? (
          <p className="text-center">
            No questions for you. Share your profile to receive questions
          </p>
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
                    <Image
                      width={150}
                      height={150}
                      alt="user image"
                      src={pageUserProfilePic}
                      className="rounded-full h-14 w-14"
                    />
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
                <CreateAnswer setQuestions={setQuestions} question={question} />
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
        <button
          className="hover:bg-stone-600 rounded-sm"
          onClick={handleLoadMore}
        >
          {loading === "loading" && "Loading..."}
          {loading === "success" &&
            questionsCount !== questions.length &&
            "Load more"}
          {loading === "error" && "Error while loading. Try again"}
        </button>
      </div>
    </>
  );
}
