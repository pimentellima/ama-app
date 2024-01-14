import { UserButton, currentUser } from "@clerk/nextjs";
import {
  InboxIcon,
  MagnifyingGlassIcon,
  UserCircleIcon
} from "@heroicons/react/16/solid";
import type { Metadata } from "next";
import Link from "next/link";
import "../globals.css";

export const metadata: Metadata = {
  title: "AskAnon",
  description: "Ask anonymously, get answers anonymously.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  return (
    <div>
      <header className="grid grid-cols-3 sticky px-16 top-0 w-full h-12 bg-stone-700 shadow-md">
        <div className="flex items-center justify-between col-start-2">
          <button title="Search">
            <MagnifyingGlassIcon className="h-6 w-6" />
          </button>
          <Link href={"/inbox"} title="Inbox">
            <InboxIcon className="h-6 w-6" />
          </Link>
          {!!user ? (
            <UserButton />
          ) : (
            <Link title="Sign in" href={"/"}>
              <UserCircleIcon className="h-6 w-6" />
            </Link>
          )}
        </div>
      </header>
      <div className="pt-3">{children}</div>
    </div>
  );
}
