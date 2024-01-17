"use server";

import prisma from "@/prismaclient";
import { clerkClient, currentUser } from "@clerk/nextjs";

export async function createPost({
  body,
  addresseeUsername,
}: {
  addresseeUsername: string;
  body: string;
}) {
  const user = await currentUser();
  const addressee = await clerkClient.users.getUserList({
    username: [addresseeUsername],
  });
  await prisma.question.create({
    data: { authorId: user?.id, body, addresseeId: addressee[0].id },
  });
}

export async function follow({
  followerId,
  followingId,
}: {
  followerId: string;
  followingId: string;
}) {
  await prisma.follow.create({ data: { followerId, followingId } });
}

export async function unfollow({
  followerId,
  followingId,
}: {
  followerId: string;
  followingId: string;
}) {
  await prisma.follow.delete({
    where: { follow_unique: { followerId, followingId } },
  });
}
