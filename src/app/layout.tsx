import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider, UserButton, currentUser } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import Link from "next/link";
import {
  BellIcon,
  HomeIcon,
  InboxIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
} from "@heroicons/react/16/solid";

const inter = Inter({ subsets: ["latin"] });

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
    <ClerkProvider>
      <html lang="en">
        <Analytics />
        <body className={inter.className}>
          {!!user ? (
            <header
              className="xl:justify-center xl:gap-24
              flex justify-around items-center sticky top-0 w-full h-12 
          bg-white dark:bg-stone-700 shadow-md"
            >
              <Link href={"/feed"} title="Feed">
                <HomeIcon className="h-6 w-6" />
              </Link>
              <Link href={"/search"} title="Search users">
                <MagnifyingGlassIcon className="h-6 w-6" />
              </Link>
              <Link href={"/inbox"} title="Inbox">
                <InboxIcon className="h-6 w-6" />
              </Link>
              <Link href={"/notifications"} title="Notifications">
                <BellIcon className="h-6 w-6" />
              </Link>
              <div className="h-6 w-6 flex items-center">
                <UserButton afterSignOutUrl="/" />
              </div>
            </header>
          ) : (
            <header
              className="xl:justify-center xl:gap-20
            flex justify-around items-center sticky top-0 w-full h-12 
        bg-white dark:bg-stone-700 shadow-md"
            >
              <Link href={"/search"} title="Search users">
                <MagnifyingGlassIcon className="h-6 w-6" />
              </Link>
              <div className="h-6 w-6 flex items-center ">
                <Link title="Sign in" href={"/"}>
                  <UserCircleIcon className="h-6 w-6" />
                </Link>
              </div>
            </header>
          )}
          <div className="pt-3 xl:pt-6 pb-2 xl:px-0 px-2">{children}</div>
        </body>
      </html>
    </ClerkProvider>
  );
}
