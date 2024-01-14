"use client";
import { PaperAirplaneIcon } from "@heroicons/react/16/solid";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function ({ username }: { username: string }) {
  const [question, setQuestion] = useState<string>("");

  async function postQuestion() {
    try {
      const res = await fetch("api/questions", {
        body: JSON.stringify({ body: question, adresseeUsername: username }),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        return toast.error("Error sending question");
      }
      toast("Question sent", {
        icon: "👏",
      });
      setQuestion("");
    } catch (e) {
      toast.error("Error sending question");
    }
  }
  return (
    <div className="flex flex-col p-1 
    bg-stone-200 dark:bg-stone-600 rounded-md ">
      <Toaster position="top-center" />
      <textarea
        maxLength={1000}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask anything"
        className="w-full text-start placeholder:text-stone-400 bg-transparent
          resize-none p-2 h-16 focus:outline-none focus:ring-0"
      />
      <div className="flex justify-between">
        <p className="text-xs text-stone-400 p-2 bottom-0">{`${question.length}/1000`}</p>
        <button title="Send question" onClick={postQuestion}>
          <PaperAirplaneIcon className="h-7 w-7" />
        </button>
      </div>
    </div>
  );
}
