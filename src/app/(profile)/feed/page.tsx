import getFeedPosts from "@/app/utils/getFeedPosts";
import { currentUser } from "@clerk/nextjs";
import { unstable_noStore } from "next/cache";
import { redirect } from "next/navigation";
import Posts from "./posts";

export default async function () {
  unstable_noStore();
  const user = await currentUser();
  if (!user) redirect("/");

  const posts = await getFeedPosts({ userId: user.id });

  return (
    <div className="flex justify-center">
      <div className="w-[750px]">
        <Posts initialPosts={posts} />
      </div>
    </div>
  );
}
