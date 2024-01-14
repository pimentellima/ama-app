import { PrismaClient } from "@prisma/client";

export async function fetchQuestions(userId: string, skip?: number) {
  const prisma = new PrismaClient();
  const questions = await prisma.question.findMany({
    where: { addresseeId: userId },
    take: 2,
    skip,
  });
  return questions;
}
