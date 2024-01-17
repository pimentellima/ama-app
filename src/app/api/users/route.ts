import getUsers from "@/app/utils/getUsers";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams.get("search");
    const skip = request.nextUrl.searchParams.get("skip");

    const users = await getUsers({ search, skip: Number(skip) });

    return Response.json(users);
  } catch (error) {
    return new Response("Internal error", { status: 500 });
  }
}
