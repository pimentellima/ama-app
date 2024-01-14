import { fetchQuestions } from "@/app/actions";
import Questions from "@/components/questions";
import { clerkClient, currentUser } from "@clerk/nextjs";
import Image from "next/image";
import CreateQuestion from "./createQuestion";
export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: { username: string };
}) {
  const loggedUser = await currentUser();
  const pageUser = (
    await clerkClient.users.getUserList({
      username: [params.username],
    })
  )[0];
  if (!pageUser)
    return <div className="px-96 text-center">Usuário não encontrado</div>;

  const isCurrentUser = pageUser.id === loggedUser?.id;

  const questions = await fetchQuestions(pageUser.id, true);
  if (!questions)
    return <div className="px-96 text-center">Erro ao carregar perfil</div>;

  return (
    <div className="flex justify-center">
      <div className="w-[750px] flex flex-col gap-3">
        <div
          className="p-4 rounded-md shadow-sm bg-white dark:bg-stone-700
        flex flex-col"
        >
          <div className="flex flex-col items-center justify-center">
            <Image
              alt="user image"
              width={150}
              height={150}
              src={pageUser.imageUrl}
              className="flex justify-center rounded-full h-32 w-32"
            />
            <p className="mt-2 font-bold tracking-wide">{pageUser.username}</p>
          </div>
          <div className="mt-3">
            <CreateQuestion username={pageUser.username as string} />
          </div>
        </div>
        {questions.length === 0 ? (
          <p className="text-center">This user has no questions yet</p>
        ) : (
          <div>
            <Questions
              isCurrentUser={isCurrentUser}
              userImageUrl={pageUser.imageUrl}
              userUsername={pageUser.username as string}
              initialQuestions={questions}
            />
          </div>
        )}
      </div>
    </div>
  );
}
