"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ({ username }: { username: string }) {
  const [question, setQuestion] = useState<string>("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function postQuestion() {
    try {
      const res = await fetch("api/question", {
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
    <>
      <div className="flex border-t border-gray-700 py-1">
        <textarea
          maxLength={1000}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask anything"
          className="w-full text-start placeholder:text-stone-400
          resize-none p-2 h-16 bg-transparent"
        />
        <button
          onClick={async () => {
            await postQuestion();
            router.refresh();
          }}
          className="px-2"
        >
          Send
        </button>
      </div>
      <p className="text-xs text-stone-400 p-2 bottom-0">{`${question.length}/1000`}</p>
      {message && <p className="p-2">{message}</p>}
    </>
  );
}
