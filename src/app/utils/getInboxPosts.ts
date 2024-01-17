import { PrismaClient } from "@prisma/client";

export async function getInboxPosts({
  skip = 0,
  user,
}: {
  skip?: number;
  user: any;
}) {
  const prisma = new PrismaClient();

  const questions = await prisma.question.findMany({
    where: { addresseeId: user.id },
    orderBy: { createdAt: "desc" },
    include: { answer: true },
    skip,
    take: 10,
  });

  const data = questions
    .map((q) => {
      if (!!q.answer)
        return {
          ...q,
          answer: { ...q.answer, user },
        };
      return q;
    })
    .sort((a, b) => {
      if (!a.answer && !b.answer) {
        if (a.createdAt > b.createdAt) return -1;
        if (a.createdAt < b.createdAt) return 1;
        else return 0;
      }
      if (!a.answer && b.answer) return -1;
      if (a.answer && !b.answer) return 1;
      else return 0;
    });
  return JSON.parse(JSON.stringify(data));
}
