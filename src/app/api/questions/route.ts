import { auth, clerkClient } from "@clerk/nextjs";
import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    const { adresseeUsername, body } = await request.json();
    if (!adresseeUsername) {
      return new Response("Missing params", { status: 400 });
    }

    const prisma = new PrismaClient();
    const adressee = (await clerkClient.users.getUserList()).find(
      (user) => user.username === adresseeUsername
    );
    if (!adressee) return new Response("Adressee not found", { status: 404 });
    const data = await prisma.question.create({
      data: {
        addresseeId: adressee.id,
        authorId: userId,
        body,
      },
    });

    return Response.json(data);
  } catch (error) {
    return new Response("Internal error", { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const skip = request.nextUrl.searchParams.get("skip");
    const username = request.nextUrl.searchParams.get("username");
    const prisma = new PrismaClient();
    if (!username) return new Response("Missing params", { status: 400 });

    const user = (
      await clerkClient.users.getUserList({
        username: [username],
      })
    )[0];

    const questions = await prisma.question.findMany({
      where: { addresseeId: user.id },
      orderBy: { createdAt: "desc" },
      take: 2,
      skip: Number(skip),
    });

    const answers = await prisma.answer.findMany({
      where: { questionId: { in: questions.map((q) => q.id) } },
      orderBy: { createdAt: "desc" },
    });

    const data = questions
      .map((question) => ({
        ...question,
        answer: answers.find((a) => a.questionId === question.id) || null,
      }))
      .filter((q) => !!q.answer);
    return Response.json(data);
  } catch (error) {
    return new Response("Internal error", { status: 500 });
  }
}
