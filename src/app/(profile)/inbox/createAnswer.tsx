"use client";
import {
  ChatBubbleOvalLeftEllipsisIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/16/solid";
import { useRouter } from "next/navigation";
import { Dispatch, useState } from "react";

export default function ({
  question,
  onReplyQuestion,
}: {
  onReplyQuestion: (questionId: number, answer: any) => void;
  question: any;
}) {
  const [showReply, setShowReply] = useState<boolean>(false);
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
        const data = await res.json();
        onReplyQuestion(question.id, data);
        setMessage("");
        setReply("");
        router.refresh();
      }
    } catch (e) {
      setMessage("Error while sending reply");
    }
  }

  return (
    <div className="grid grid-cols-[80%_1gr]">
      <textarea
        maxLength={500}
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        placeholder="Reply"
        className={`${!showReply && "hidden"} flex py-1 mt-1
      w-full text-start placeholder:text-stone-400
      resize-none p-2 h-16 bg-transparent focus:ring-stone-300 focus:!border-none`}
      />

      {message && <p className="p-2">{message}</p>}
      <div className="w-full flex justify-end items-center mt-2 pr-3">
        {showReply ? (
          <button title="Send reply" onClick={postReply}>
            <PaperAirplaneIcon className="h-7 w-7" />
          </button>
        ) : (
          <button title="Reply" onClick={() => setShowReply(true)}>
            <ChatBubbleOvalLeftEllipsisIcon className="h-7 w-7 text-stone-300" />
          </button>
        )}
      </div>
    </div>
  );
}
