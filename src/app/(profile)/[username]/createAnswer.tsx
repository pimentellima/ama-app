"use client";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";

export default function ({
  question,
  setQuestions,
}: {
  setQuestions: Dispatch<SetStateAction<any[]>>;
  question: {
    answer: {
      id: number;
      body: string;
      createdAt: Date;
      authorId: string;
      questionId: number;
    } | null;
    id: number;
    body: string;
    createdAt: Date;
    authorId: string | null;
    addresseeId: string;
  };
}) {
  const [reply, setReply] = useState<string>("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function postReply() {
    try {
      const res = await fetch("api/answers", {
        body: JSON.stringify({ body: reply, questionId: question.id }),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        setMessage("");
        setReply("");
        const answer = await res.json();
        setQuestions((questions) => {
          const newQuestions = [...questions];
          const index = newQuestions.findIndex((q) => q.id === question.id);
          if (index === -1) return questions;
          newQuestions[index].answer = answer;
          return newQuestions;
        });
        router.refresh();
      }
    } catch (e) {
      setMessage("Error while sending reply");
    }
  }

  return (
    <>
      <div className="flex py-1 mt-1">
        <textarea
          maxLength={500}
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Reply"
          className="w-full text-start placeholder:text-stone-400
         resize-none p-2 h-16 bg-transparent"
        />
        <button onClick={postReply} className="px-2">
          Send
        </button>
      </div>
      <p className="text-xs text-stone-400 p-2 bottom-0">{`${reply.length}/500`}</p>
      {message && <p className="p-2">{message}</p>}
    </>
  );
}
