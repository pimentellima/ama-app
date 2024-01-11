import {
  SignInButton,
  SignOutButton,
  UserButton,
  currentUser,
} from "@clerk/nextjs";
import Link from "next/link";

export default async function UserWidget() {
  const user = await currentUser();

  return (
    <>
      {!!user ? (
        <div className="flex flex-col gap-1">
          <div className="flex gap-3">
            <Link className="hover:underline" href={`/${user.username}`}>
              {user.username}
            </Link>
            <UserButton />
          </div>
          <SignOutButton />
        </div>
      ) : (
        <SignInButton />
      )}
    </>
  );
}
