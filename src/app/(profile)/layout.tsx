import { UserButton } from "@clerk/nextjs";
import {
  BellIcon,
  InboxIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/16/solid";
import type { Metadata } from "next";
import "../globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AskAnon",
  description: "Ask anonymously, get answers anonymously.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
          <button title="Notifications">
            <BellIcon className="h-6 w-6" />
          </button>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>
      <div className="pt-3">{children}</div>
    </div>
  );
}
