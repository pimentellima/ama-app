import { clerkClient, currentUser } from "@clerk/nextjs";
import { PrismaClient } from "@prisma/client";
import { getQuestions, getQuestionsCount } from "@/app/actions";
export const dynamic = "force-dynamic";

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
    <div className="px-96">
      <div className="w-full flex flex-col bg-stone-800 rounded-sm">
        <div
          className="grid grid-cols-2 h-12 
        justify-items-center place-items-center
        text-lg"
        >
          <div>{params.username}</div>
          <div>{`${questionsCount} questions`}</div>
        </div>
      </div>
      <div className="mt-3 w-full"></div>
    </div>
  );
}
