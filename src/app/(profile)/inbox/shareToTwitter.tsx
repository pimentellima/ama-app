"use client";
import { TwitterShareButton } from "react-share";

export default function ({
  username,
  text,
}: {
  username: string;
  text: string;
}) {
  return (
    <TwitterShareButton
      url={
        process.env.NEXT_PUBLIC_BASE_URL
          ? `${process.env.NEXT_PUBLIC_BASE_URL}/${username}`
          : ""
      }
      title={text}
    >
      <p className="hover:bg-stone-600 h-12 flex items-center justify-center">
        Share on Twitter
      </p>
    </TwitterShareButton>
  );
}
