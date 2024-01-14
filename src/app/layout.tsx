import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider, UserButton, currentUser } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import Link from "next/link";
import {
  BellIcon,
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
  if (!user)
    return (
      <ClerkProvider>
        <html lang="en">
          <Analytics />
          <body className={inter.className}>
            <header className="grid grid-cols-3 sticky px-16 top-0 w-full h-12 
            bg-white dark:bg-stone-700 shadow-md">
              <div className="flex items-center justify-center gap-20 col-start-2">
                <Link href={"/search"} title="Search users">
                  <MagnifyingGlassIcon className="h-6 w-6" />
                </Link>
                <div className="h-6 w-6">
                  <Link title="Sign in" href={"/"}>
                    <UserCircleIcon className="h-6 w-6" />
                  </Link>
                </div>
              </div>
            </header>
            <div className="pt-6">{children}</div>
          </body>
        </html>
      </ClerkProvider>
    );

  return (
    <ClerkProvider>
      <html lang="en">
        <Analytics />
        <body className={inter.className}>
          <header className="grid grid-cols-3 sticky px-16 top-0 w-full h-12 
          bg-white dark:bg-stone-700 shadow-md">
            <div className="flex items-center justify-between col-start-2">
              <Link href={"/search"} title="Search users">
                <MagnifyingGlassIcon className="h-6 w-6" />
              </Link>
              <Link href={"/inbox"} title="Inbox">
                <InboxIcon className="h-6 w-6" />
              </Link>
              <Link href={"/notifications"} title="Notifications">
                <BellIcon className="h-6 w-6" />
              </Link>
              <div className="h-6 w-6">
                <UserButton />
              </div>
            </div>
          </header>
          <div className="pt-6 pb-2">{children}</div>
        </body>
      </html>
    </ClerkProvider>
  );
}
