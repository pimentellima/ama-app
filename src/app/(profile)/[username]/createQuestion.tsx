"use client";
import { PaperAirplaneIcon } from "@heroicons/react/16/solid";
import { useState } from "react";

export default function ({ username }: { username: string }) {
  const [question, setQuestion] = useState<string>("");
  const [message, setMessage] = useState("");

  async function postQuestion() {
    try {
      const res = await fetch("api/questions", {
        body: JSON.stringify({ body: question, adresseeUsername: username }),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        setMessage("");
        setQuestion("");
      }
    } catch (e) {
      setMessage("Error while sending question");
    }
  }
  return (
    <div className="flex flex-col p-1 bg-stone-600 rounded-md ">
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
      {message && <p className="p-2">{message}</p>}
    </div>
  );
}
