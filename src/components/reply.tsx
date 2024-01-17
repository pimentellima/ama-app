import { User } from "@clerk/nextjs/server";
import { Answer } from "@prisma/client";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";

export default function ({ answer }: { answer: Answer & { user: User } }) {
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
