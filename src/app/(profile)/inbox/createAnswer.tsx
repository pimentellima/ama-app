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
    <div className="grid grid-cols-[80%_1gr] mt-2">
      {showReply ? (
        <div className="flex flex-col p-1 bg-stone-600 rounded-md ">
          <textarea
            maxLength={500}
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Type here ..."
            className="w-full text-start placeholder:text-stone-400 bg-transparent
          resize-none p-2 h-16 focus:outline-none focus:ring-0"
          />
          <div className="flex justify-between">
            <p className="text-xs text-stone-400 p-2 bottom-0">{`${reply.length}/1000`}</p>
            <button title="Send question" onClick={postReply}>
              <PaperAirplaneIcon className="h-7 w-7" />
            </button>
          </div>
          {message && <p className="p-2">{message}</p>}
        </div>
      ) : (
        <div className="flex justify-end items-center pr-1">
          <button title="Reply" onClick={() => setShowReply(true)}>
            <ChatBubbleOvalLeftEllipsisIcon className="h-7 w-7 text-stone-300" />
          </button>
        </div>
      )}

      {message && <p className="p-2">{message}</p>}
    </div>
  );
}
