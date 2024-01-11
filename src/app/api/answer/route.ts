import { auth } from "@clerk/nextjs";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    const { questionId, body } = await request.json();
    if (!userId) {
      return new Response("Missing params", { status: 409 });
    }

    const prisma = new PrismaClient();
    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });
    if (!question) return new Response("Question not found", { status: 404 });

    await prisma.answer.create({
      data: {
        questionId,
        authorId: userId,
        body,
      },
    });

    return new Response("Question created", { status: 200 });
  } catch (error) {
    return new Response("Internal error", { status: 500 });
  }
}
