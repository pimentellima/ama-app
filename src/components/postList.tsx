"use client";

import LoadMoreButton from "@/components/loadMoreButton";
import moment from "moment";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import Link from "next/link";
import { Answer, Question } from "@prisma/client";
import { User } from "@clerk/nextjs/server";
import Image from "next/image";

function Reply({ answer }: { answer: Answer & { user: User } }) {
  return (
    <div className="flex flex-col">
      <div className="flex mt-2">
        <Image
          width={150}
          height={150}
          alt="user image"
          src={answer.user.imageUrl}
          className="rounded-full h-14 w-14"
        />
        <div className="ml-2 flex flex-col">
          <Link href={`/${answer.user.username}`} className="hover:underline">
            {answer.user.username}
          </Link>
          <p className="text-xs text-stone-400">{`${moment(
            answer.createdAt
          ).fromNow(true)} ago`}</p>
        </div>
      </div>
      <div
        className="flex border-stone-700 px-2 py-1 mt-2
        break-all"
      >
        {answer.body}
      </div>
    </div>
  );
}

export default function ({
  posts,
}: {
  posts: ((Question & { user?: User }) & { answer: Answer & { user: User } })[];
}) {
  return (
    <div className="flex flex-col gap-3">
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
              <div
                className="flex border-stone-700 px-2 py-1 mt-2
        break-all"
              >
                {question.answer.body}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
