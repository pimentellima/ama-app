import { auth, clerkClient } from "@clerk/nextjs";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    const { adresseeUsername, body } = await request.json();
    if (!userId || !adresseeUsername) {
      return new Response("Missing params", { status: 409 });
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
    revalidatePath(`/${adresseeUsername}`);
    return new Response("Question created", { status: 200 });
  } catch (error) {
    return new Response("Internal error", { status: 500 });
  }
}
