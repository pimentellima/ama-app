import { getQuestions } from "@/app/utils/getQuestions";
import prisma from "@/prismaclient";
import { auth, clerkClient } from "@clerk/nextjs";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const skip = request.nextUrl.searchParams.get("skip") || 0;
    const username = request.nextUrl.searchParams.get("username");
    const filterAnswers = request.nextUrl.searchParams.get("filterAnswers");

    if (!username) return new Response("Missing params", { status: 400 });

    const user = (
      await clerkClient.users.getUserList({
        username: [username],
      })
    )[0];

    const data = await getQuestions({
      userId: user.id,
      skip: Number(skip),
      filterAnswers: filterAnswers === "true",
    });
    return Response.json(data);
  } catch (error) {
    return new Response("Internal error", { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const questionId = request.nextUrl.searchParams.get("questionId");

    if (!questionId) return new Response("Missing params", { status: 400 });

    await prisma.answer.deleteMany({
      where: { questionId: parseInt(questionId) },
    });

    const question = await prisma.question.delete({
      where: { id: parseInt(questionId) },
    });

    if (!question) {
      return new Response("Error while deleting question", { status: 500 });
    }

    return Response.json({ message: "Question deleted successfully" });
  } catch (error) {
    console.log(error);
    return new Response("Internal error", { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    const { adresseeUsername, body } = await request.json();
    if (!adresseeUsername) {
      return new Response("Missing params", { status: 400 });
    }

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
