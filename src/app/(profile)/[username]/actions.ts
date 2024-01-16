"use server";

import prisma from "@/prismaclient";

export async function follow({
  followerId,
  followingId,
}: {
  followerId: string;
  followingId: string;
}) {
  return await prisma.follow.create({ data: { followerId, followingId } });
}

export async function unfollow({
  followerId,
  followingId,
}: {
  followerId: string;
  followingId: string;
}) {
  return await prisma.follow.delete({
    where: { follow_unique: { followerId, followingId } },
  });
}
