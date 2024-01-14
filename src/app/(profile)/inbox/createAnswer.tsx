"use client";
import {
  PaperAirplaneIcon
} from "@heroicons/react/16/solid";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function ({
  question,
  onReplyQuestion,
}: {
  onReplyQuestion: (questionId: number, answer: any) => void;
  question: any;
}) {
  const [showReply, setShowReply] = useState<boolean>(false);
  const [reply, setReply] = useState<string>("");
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
      if (!res.ok) {
        return toast.error("Error sending reply");
      }
      toast("Reply sent", {
        icon: "👏",
      });
      const data = await res.json();
      onReplyQuestion(question.id, data);
      setReply("");
      router.refresh();
    } catch (e) {
      toast.error("Error sending reply");
    }
  }

  return (
    <div className="grid grid-cols-[80%_1gr] mt-2">
      <Toaster position="top-center" />
      {showReply ? (
        <div className="flex flex-col p-1 bg-stone-600 rounded-md ">
          <textarea
            maxLength={500}
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Type here..."
            className="w-full text-start placeholder:text-stone-400 bg-transparent
          resize-none p-2 h-16 focus:outline-none focus:ring-0"
          />
          <div className="flex justify-between">
            <p className="text-xs text-stone-400 p-2 bottom-0">{`${reply.length}/500`}</p>
            <button title="Send question" onClick={postReply}>
              <PaperAirplaneIcon className="h-7 w-7" />
            </button>
          </div>
        </div>
      ) : (
        <button
          className="text-center py-2 rounded-md hover:bg-stone-600"
          title="Reply"
          onClick={() => setShowReply(true)}
        >
          Reply
        </button>
      )}
    </div>
  );
}
