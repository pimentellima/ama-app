import { User } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

export async function getProfilePosts({
  user,
  skip = 0,
}: {
  user: User;
  skip?: number;
}) {
  const prisma = new PrismaClient();

  const answers = await prisma.answer.findMany({
    where: { authorId: user.id },
    include: { question: true },
    orderBy: { createdAt: "desc" },
    skip,
    take: 10,
  });

  const data = answers.map((answer) => {
    const { question, ...rest } = answer;
    return {
      ...question,
      answer: {
        ...rest,
        user,
      },
    };
  });
  return JSON.parse(JSON.stringify(data));
}
