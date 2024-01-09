import { SignIn, SignInButton, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="h-screen">
      <SignInButton redirectUrl="/me"/>
    </div>
  );
}
