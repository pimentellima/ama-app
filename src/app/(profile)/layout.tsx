import UserWidget from "@/components/userwidget";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

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
      <div
        className="absolute top-5 right-5 flex
        text-white"
      >
        <UserWidget />
      </div>
      {children}
    </div>
  );
}
