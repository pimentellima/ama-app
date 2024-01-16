import getFeedPosts from "@/app/utils/getFeedPosts";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import PostsFeed from "./postsFeed";

export default async function () {
  const user = await currentUser();
  if (!user) redirect("/");

  const initialPosts = await getFeedPosts({ user });

  return (
    <div className="flex justify-center">
      <div className="w-[750px]">
        <PostsFeed initialPosts={JSON.parse(JSON.stringify(initialPosts))} />
      </div>
    </div>
  );
}
