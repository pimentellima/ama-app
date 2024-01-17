"use server";

import prisma from "@/prismaclient";
import { revalidatePath } from "next/cache";

export async function deletePost({ questionId }: { questionId: number }) {
  await prisma.answer.deleteMany({
    where: { questionId },
  });

  await prisma.question.delete({
    where: { id: questionId },
  });
  revalidatePath("/inbox");
}
