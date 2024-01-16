import { PrismaClient } from "@prisma/client";

export async function getQuestions(
    userId: string,
    filterWithAnswers?: boolean
  ) {
    const prisma = new PrismaClient();
  
    const questions = await prisma.question.findMany({
      where: { addresseeId: userId },
      orderBy: { createdAt: "desc" },
      take: 10,
    });
    const answers = await prisma.answer.findMany({
      where: { questionId: { in: questions.map((q) => q.id) } },
      orderBy: { createdAt: "desc" },
    });
    if (filterWithAnswers) {
      return questions
        .map((question) => ({
          ...question,
          answer: answers.find((a) => a.questionId === question.id) || null,
        }))
        .filter((q) => !!q.answer);
    }
    return questions.map((question) => ({
      ...question,
      answer: answers.find((a) => a.questionId === question.id) || null,
    }));
  }