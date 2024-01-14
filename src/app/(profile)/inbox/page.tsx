import { currentUser } from "@clerk/nextjs";
import { PrismaClient } from "@prisma/client";
import moment from "moment";
import Image from "next/image";
import CreateAnswer from "./createAnswer";
import ShareToTwitter from "./shareToTwitter";
import Questions from "./questions";

async function getQuestions(userId: string) {
  const prisma = new PrismaClient();

  const questions = await prisma.question.findMany({
    where: { addresseeId: userId },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
  const answers = await prisma.answer.findMany({
    where: { questionId: { in: questions.map((q) => q.id) } },
    orderBy: { createdAt: "desc" },
  });
  return questions.map((question) => ({
    ...question,
    answer: answers.find((a) => a.questionId === question.id) || null,
  }));
}

/* async function getQuestionsCount(userId: string) {
  try {
    const prisma = new PrismaClient();

    const count = await prisma.question.count({
      where: { addresseeId: userId },
    });
    return count;
  } catch (error) {
    return new Response("Internal error", { status: 500 });
  }
} */

export default async function () {
  const user = await currentUser();
  if (!user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const questions = await getQuestions(user.id);
  if (!questions) {
    return (
      <div className="w-[600px] text-center">
        An error occurred while loading questions
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="w-[750px]">
        <div className="text-center rounded-md bg-stone-700 shadow-sm py-4">
          <p>Share your profile</p>
          <p className="text-lg text-red-700">{`${process.env.NEXT_PUBLIC_BASE_URL}/${user.username}`}</p>
        </div>
        <div className="my-3">
          {questions.length === 0 ? (
            <p className="text-center">Your questions will appear here</p>
          ) : (
            <Questions
              userImageUrl={user.imageUrl}
              userUsername={user.username as string}
              initialQuestions={questions}
            />
          )}
        </div>
      </div>
    </div>
  );
}
