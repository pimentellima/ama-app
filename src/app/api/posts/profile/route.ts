import { getProfilePosts } from "@/app/utils/getProfilePosts";
import { clerkClient } from "@clerk/nextjs";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const skip = request.nextUrl.searchParams.get("skip") || 0;
    const username = request.nextUrl.searchParams.get("username") || "";
    if (!username) return new Response("Missing params", { status: 400 });

    const user = await clerkClient.users.getUserList({ username: [username] });

    const posts = await getProfilePosts({ skip: Number(skip), user: user[0] });

    return Response.json(posts);
  } catch (error) {
    console.log(error);
    return new Response("Internal error", { status: 500 });
  }
}
