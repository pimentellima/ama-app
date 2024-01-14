import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function () {
  const user = await currentUser();
  if (!user) {
    return redirect("/");
  }
  return (
    <div className="flex justify-center">
      <div
        className="w-[750px] flex flex-col p-3 
      bg-stone-700 rounded-md shadow-sm"
      >
        <p className="text-center">You have 0 notifications</p>
      </div>
    </div>
  );
}
