import { getInboxPosts } from "@/app/utils/getInboxPosts";
import { auth, clerkClient } from "@clerk/nextjs";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const skip = request.nextUrl.searchParams.get("skip") || 0;
    const clerkAuth = auth();
    const userId = clerkAuth.userId;
    if (!clerkAuth || !userId)
      return new Response("Unauthorized", { status: 401 });

    const user = await clerkClient.users.getUser(userId);

    const posts = await getInboxPosts({ skip: Number(skip), user });

    return Response.json(posts);
  } catch (error) {
    return new Response("Internal error", { status: 500 });
  }
}
