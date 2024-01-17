import prisma from "@/prismaclient";
import { clerkClient } from "@clerk/nextjs";

export default async function ({
  skip = 0,
  userId,
}: {
  skip?: number;
  userId: string;
}) {
  const followings = await prisma.follow.findMany({
    where: { followerId: userId },
  });

  const answers = await prisma.answer.findMany({
    where: { authorId: { in: followings.map((q) => q.followingId) } },
    orderBy: { createdAt: "desc" },
    include: { question: true },
    take: 10,
    skip,
  });

  const users = (await clerkClient.users.getUserList()).filter((u) =>
    answers.map((a) => answers.map((a) => a.authorId).includes(a.authorId))
  );

  const data = answers.map((answer) => {
    const { question, ...rest } = answer;
    return {
      ...question,
      answer: {
        ...rest,
        user: users.find((u) => u.id === answer.authorId),
      },
    };
  });

  return JSON.parse(JSON.stringify(data));
}
