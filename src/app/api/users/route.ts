import prisma from "@/prismaclient";
import { auth, clerkClient } from "@clerk/nextjs";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams.get("search");
    const skip = request.nextUrl.searchParams.get("skip");
    const users = await clerkClient.users.getUserList({
      limit: 10,
      offset: Number(skip),
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
      const usersWithIsFollowing = filteredUsers.map((user) => {
        const isFollowing = followingsIds.includes(user.id);
        return { ...user, isFollowing };
      });

      return Response.json(usersWithIsFollowing);
    }

    return Response.json(filteredUsers);
  } catch (error) {
    return new Response("Internal error", { status: 500 });
  }
}
