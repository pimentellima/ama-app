import { SignOutButton, currentUser, useAuth } from "@clerk/nextjs";
import CreateQuestion from "./createQuestion";
import { clerkClient } from "@clerk/nextjs";
import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import moment from "moment";
import Answer from "./answer";

async function getQuestions(username: string) {
  try {
    const prisma = new PrismaClient();
    const user = await clerkClient.users.getUserList({ username: [username] });
    if (!user) return new Response("User not found", { status: 404 });
    const questions = await prisma.question.findMany({
      where: { addresseeId: user[0].id },
    });
    const questionsIds = questions.map((q) => q.id);
    const answers = await prisma.answer.findMany({
      where: { questionId: { in: questionsIds } },
    });
    return questions.map((question) => ({
      ...question,
      answer: answers.find((a) => a.questionId === question.id) || null,
    }));
  } catch (error) {
    return new Response("Internal error", { status: 500 });
  }
}

export default async function Page({
  params,
}: {
  params: { username: string };
}) {
  const user = await currentUser();
  const isCurrentUser = user?.username === params.username;

  const questions = await getQuestions(params.username);
  if (questions instanceof Response)
    return <div className="px-96 text-center">Erro ao carregar perfil</div>;

  return (
    <div className="px-96 mt-3">
      <div className="w-full flex flex-col bg-stone-800 rounded-sm">
        <div className="h-32 bg-stone-600"></div>
        <div
          className="grid grid-cols-2 h-12 
        justify-items-center place-items-center
        text-lg"
        >
          <div>{params.username}</div>
          <div>{`${questions.length} questions`}</div>
        </div>
        {!isCurrentUser && <CreateQuestion username={params.username} />}
      </div>
      <div className="mt-3 w-full flex flex-col gap-2">
        {questions.length === 0 ? (
          <span>No questions</span>
        ) : (
          questions.map((question) => (
            <div className="flex flex-col bg-stone-800 rounded-sm py-2">
              <div className="px-2 text-xs text-end">
                {`Anon · ${moment(question.createdAt).fromNow(true)}`}
              </div>
              <p className="px-2 break-words">
                {question.body}
              </p>
              {isCurrentUser && (
                <Answer username={params.username} question={question} />
              )}
            </div>
          ))
        )}
      </div>
      <div className="flex h-full items-end">
        <SignOutButton />
      </div>
    </div>
  );
}
