import prisma from "@/prismaclient";
import { auth, currentUser } from "@clerk/nextjs";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    const { questionId, body } = await request.json();
    if (!userId) {
      return new Response("Missing params", { status: 409 });
    }
    const user = await currentUser()
    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });
    if (!question) return new Response("Question not found", { status: 404 });
    if (question.addresseeId !== userId)
      return new Response("Unauthorized", { status: 401 });

    const answer = await prisma.answer.create({
      data: {
        questionId,
        authorId: userId,
        body,
      },
    });

    return Response.json({ ...question, answer: {...answer, user} });
  } catch (error) {
    return new Response("Internal error", { status: 500 });
  }
}
