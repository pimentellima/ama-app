import prisma from "@/prismaclient";
import { auth, clerkClient } from "@clerk/nextjs";
import { NextRequest } from "next/server";

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
    const post = await prisma.question.create({
      data: {
        addresseeId: adressee.id,
        authorId: userId,
        body,
      },
    });

    return Response.json(post);
  } catch (error) {
    return new Response("Internal error", { status: 500 });
  }
}
