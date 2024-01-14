import { SignIn, currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await currentUser();
  if (user) {
    redirect("/inbox");
  }

  return (
    <div className="h-screen flex items-center py-10 flex-col">
      <div className="flex flex-col items-center justify-center h-full">
        <SignIn appearance={{ variables: { colorPrimary: "#44403c" } }} />
      </div>
    </div>
  );
}
