import { clerkClient } from "@clerk/nextjs";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const username = request.nextUrl.searchParams.get("username");

    const users = await clerkClient.users.getUserList({
      limit: 20,
    });

    const data = username
      ? users.filter((user) => user.username?.includes(username))
      : users;

    return Response.json(data);
  } catch (error) {
    return new Response("Internal error", { status: 500 });
  }
}
