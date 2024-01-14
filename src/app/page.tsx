import { SignIn, currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await currentUser();
  if (user) {
    redirect(`/${user.username}`);
  }

  return (
    <div className="h-screen flex items-center py-10 flex-col">
      <h1 className="text-6xl font-serif">AskAnon</h1>
      <h2 className="text-sm tracking-widest text-stone-400">
        Ask questions anonymously
      </h2>
      <div className="flex items-center justify-center h-full">
        <SignIn appearance={{ variables: { colorPrimary: "#44403c" } }} />
      </div>
    </div>
  );
}
