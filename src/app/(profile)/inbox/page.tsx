import { getInboxPosts } from "@/app/utils/getInboxPosts";
import { currentUser } from "@clerk/nextjs";
import { unstable_noStore } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";
import Posts from "./posts";

export default async function () {
  unstable_noStore();

  const user = await currentUser();

  if (!user) {
    return redirect("/");
  }

  const posts = await getInboxPosts({ user });
  if (!posts) {
    return (
      <div className="w-[600px] text-center">
        An error occurred while loading questions
      </div>
    );
  }

  return (
    <div>
      <div
        className="text-center rounded-md bg-white
         dark:bg-stone-700 shadow-sm py-4"
      >
        <p>Share your profile</p>
        <Link
          href={`/${user.username}`}
          className="text-base xl:text-xl text-red-500 font-semibold hover:underline"
        >{`${process.env.NEXT_PUBLIC_BASE_URL}/${user.username}`}</Link>
      </div>
      <div className="mt-3">
        {posts.length === 0 ? (
          <p className="text-center">Your questions will appear here</p>
        ) : (
          <Posts initialPosts={posts} />
        )}
      </div>
    </div>
  );
}
