"use server";
import prisma from "@/prismaclient";
import { auth, clerkClient } from "@clerk/nextjs";

export default async function getUsers({
  skip = 0,
  search = "",
}: {
  skip?: number;
  search?: string | null;
}) {
  const users = await clerkClient.users.getUserList({
    limit: 10,
    offset: skip,
  });

  const filteredUsers = users.filter((user) =>
    user.username?.includes(search || "")
  );

  const clerkAuth = auth();
  if (clerkAuth.userId) {
    const followingsIds = (
      await prisma.follow.findMany({
        where: { followerId: clerkAuth.userId },
        select: { id: false, followerId: false, followingId: true },
      })
    ).map((following) => following.followingId);

    const data = filteredUsers.map((user) => {
      const isFollowing = followingsIds.includes(user.id);
      return { ...user, isFollowing };
    });
    return JSON.parse(JSON.stringify(data));
  }
  return JSON.parse(JSON.stringify(filteredUsers));
}
