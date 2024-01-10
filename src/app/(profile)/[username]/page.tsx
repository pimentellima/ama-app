import { clerkClient, currentUser } from "@clerk/nextjs";
import { PrismaClient } from "@prisma/client";
import moment from "moment";
import Answer from "./answer";
import CreateQuestion from "./createQuestion";

async function getQuestions(userId: string) {
  try {
    const prisma = new PrismaClient();

    const questions = await prisma.question.findMany({
      where: { addresseeId: userId },
      orderBy: { createdAt: "desc" },
    });
    const questionsIds = questions.map((q) => q.id);
    const answers = await prisma.answer.findMany({
      where: { questionId: { in: questionsIds } },
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

  const questions = await getQuestions(pageUser.id);
  if (questions instanceof Response)
    return <div className="px-96 text-center">Erro ao carregar perfil</div>;

  return (
    <div className="px-96 mt-3">
      <div className="w-full flex flex-col bg-stone-800 rounded-sm">
        <div
          className="grid grid-cols-2 h-12 
        justify-items-center place-items-center
        text-lg"
        >
          <div>{params.username}</div>
          <div>{`${questions.length} questions`}</div>
        </div>
        {!isCurrentUserPage && <CreateQuestion username={params.username} />}
      </div>
      <div className="mt-3 w-full flex flex-col gap-2">
        {questions.length === 0 ? (
          <span>No questions</span>
        ) : (
          questions.map((question, index) => (
            <div
              key={index}
              className="px-2 flex flex-col bg-stone-800 rounded-sm py-2"
            >
              <p className="break-words">{question.body}</p>
              <p className="text-xs text-stone-400">{`Anon · ${moment(
                question.createdAt
              ).fromNow(true)} ago`}</p>
              {question.answer && (
                <div className="flex flex-col">
                  <div className="flex mt-2">
                    <div
                      className="rounded-full bg-stone-400 flex
                     items-center justify-center text-xs h-14 w-14"
                    >
                      Avatar
                    </div>
                    <div className="ml-2 flex flex-col">
                      <div className="">{pageUser.username}</div>
                      <p className="text-xs text-stone-400">{`${moment(
                        question.answer.createdAt
                      ).fromNow(true)} ago`}</p>
                    </div>
                  </div>
                  <div className="flex border-stone-700 px-2 py-1 mt-2">
                    {question.answer.body}
                  </div>
                </div>
              )}
              {!question.answer && isCurrentUserPage && (
                <Answer username={params.username} question={question} />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
