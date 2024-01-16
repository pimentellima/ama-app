import { PrismaClient } from "@prisma/client";

export async function getQuestions({
  userId,
  filterAnswers = false,
  skip = 0,
}: {
  userId: string;
  filterAnswers?: boolean;
  skip?: number;
}) {
  const prisma = new PrismaClient();

  const questions = await prisma.question.findMany({
    where: { addresseeId: userId },
    orderBy: { createdAt: "desc" },
  });
  const answers = await prisma.answer.findMany({
    where: { questionId: { in: questions.map((q) => q.id) } },
  });
  if (filterAnswers) {
    return questions
      .map((question) => ({
        ...question,
        answer: answers.find((a) => a.questionId === question.id) || null,
      }))
      .filter((q) => !!q.answer)
      .splice(skip, 10);
  }

  return questions
    .map((question) => ({
      ...question,
      answer: answers.find((a) => a.questionId === question.id) || null,
    }))
    .sort((a, b) => {
      if (a.answer && b.answer) return 0;
      if (a.answer && !b.answer) return 1;
      else return -1;
    })
    .splice(skip, 10);
}
