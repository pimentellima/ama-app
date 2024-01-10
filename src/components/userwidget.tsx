import { SignInButton, SignOutButton, currentUser } from "@clerk/nextjs";
import Link from "next/link";

export default async function UserWidget() {
  const user = await currentUser();

  return (
    <>
      {!!user ? (
        <div className="flex flex-col gap-1">
          <Link className="hover:underline" href={`/${user.username}`}>
            {user.username}
          </Link>
          <SignOutButton />
        </div>
      ) : (
        <SignInButton />
      )}
    </>
  );
}
