import prisma from "@/prismaclient";
import { clerkClient } from "@clerk/nextjs";

export default async function ({
  skip = 0,
  user,
}: {
  skip?: number;
  user: any;
}) {
  const followings = await prisma.follow.findMany({
    where: { followerId: user.id },
  });

  const answers = await prisma.answer.findMany({
    where: { authorId: { in: followings.map((q) => q.followingId) } },
    orderBy: { createdAt: "desc" },
  });

  const users = (await clerkClient.users.getUserList()).filter((u) =>
    answers.map((a) => a.authorId).includes(u.id)
  );

  const questions = await prisma.question.findMany({
    where: { id: { in: answers.map((a) => a.questionId) } },
  });

  const answersWithUserData = answers.map((a) => ({
    ...a,
    user: users.find((u) => u.id === a.authorId),
  }));

  return questions
    .map((question) => ({
      ...question,
      answer:
        answersWithUserData.find((a) => a.questionId === question.id) || null,
    }))
    .filter((q) => !!q.answer)
    .splice(skip, 10);
}
