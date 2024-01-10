import { auth, clerkClient } from "@clerk/nextjs";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
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
    await prisma.question.create({
      data: {
        addresseeId: adressee.id,
        authorId: userId,
        body,
      },
    });

    return new Response("Question created", { status: 200 });
  } catch (error) {
    return new Response("Internal error", { status: 500 });
  }
}
