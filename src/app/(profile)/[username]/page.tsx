import { clerkClient, currentUser } from "@clerk/nextjs";
import { Prisma, PrismaClient } from "@prisma/client";
import moment from "moment";
import CreateAnswer from "./createAnswer";
import CreateQuestion from "./createQuestion";
import ShareToTwitter from "./shareToTwitter";
import ListQuestions from "./listQuestions";

async function getQuestions(userId: string) {
  try {
    const prisma = new PrismaClient();

    const questions = await prisma.question.findMany({
      where: { addresseeId: userId },
      orderBy: { createdAt: "desc" },
      take: 2,
    });
    const answers = await prisma.answer.findMany({
      where: { questionId: { in: questions.map((q) => q.id) } },
      orderBy: { createdAt: "desc" },
    });
    return questions.map((question) => ({
      ...question,
      answer: answers.find((a) => a.questionId === question.id) || null,
    }));
  } catch (error) {
    return new Response("Internal error", { status: 500 });
  }
}

async function getQuestionsCount(userId: string) {
  try {
    const prisma = new PrismaClient();

    const count = await prisma.question.count({
      where: { addresseeId: userId },
    });
    return count;
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
  const pageUser = (
    await clerkClient.users.getUserList({
      username: [params.username],
    })
  )[0];
  if (!pageUser)
    return <div className="px-96 text-center">Usuário não encontrado</div>;
  const isCurrentUserPage = user?.username === params.username;

  const questionsCount = await getQuestionsCount(pageUser.id);
  const questions = await getQuestions(pageUser.id);
  if (questions instanceof Response || questionsCount instanceof Response)
    return <div className="px-96 text-center">Erro ao carregar perfil</div>;

  return (
    <div className="px-96 my-3">
      <div className="w-full flex flex-col bg-stone-800 rounded-sm">
        <div
          className="grid grid-cols-2 h-12 
        justify-items-center place-items-center
        text-lg"
        >
          <div>{params.username}</div>
          <div>{`${questionsCount} questions`}</div>
        </div>
        {!isCurrentUserPage && <CreateQuestion username={params.username} />}
      </div>
      <div className="mt-3 w-full">
        <ListQuestions
          initialQuestions={questions}
          isCurrentUserPage={isCurrentUserPage}
          pageUserUsername={params.username}
        />
      </div>
    </div>
  );
}
