import { getQuestions } from "@/app/utils/getQuestions";
import prisma from "@/prismaclient";
import { clerkClient, currentUser } from "@clerk/nextjs";
import Image from "next/image";
import CreateQuestion from "./createQuestion";
import UserInfo from "./userInfo";
import PostList from "@/components/postList";
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

  const questionsCount = await prisma.question.count({
    where: { addresseeId: pageUser.id },
  });

  const followingCount = await prisma.follow.count({
    where: { followerId: pageUser.id },
  });

  const followersCount = await prisma.follow.count({
    where: { followingId: pageUser.id },
  });

  const isFollowing: boolean = loggedUser
    ? !!(await prisma.follow.findUnique({
        where: {
          follow_unique: {
            followerId: loggedUser.id,
            followingId: pageUser.id,
          },
        },
      }))
    : false;

  const isCurrentUser = pageUser.id === loggedUser?.id;

  const questions = await getQuestions({
    userId: pageUser.id,
    filterAnswers: true,
  });
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
            <UserInfo
              loggedUser={JSON.parse(JSON.stringify(loggedUser))}
              user={JSON.parse(JSON.stringify(pageUser))}
              initialProfileData={{
                followersCount,
                isFollowing,
                followingCount,
                questionsCount,
              }}
            />
          </div>
          <div className="mt-3">
            <CreateQuestion username={pageUser.username as string} />
          </div>
        </div>
        {questions.length === 0 ? (
          <p className="text-center">This user has no questions yet</p>
        ) : (
          <div>
            <PostList
              isCurrentUser={isCurrentUser}
              userImageUrl={pageUser.imageUrl}
              userUsername={pageUser.username as string}
              initialPosts={questions}
            />
          </div>
        )}
      </div>
    </div>
  );
}
