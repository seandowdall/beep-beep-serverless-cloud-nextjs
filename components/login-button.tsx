"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "./ui/button";

export default function Component() {
  const { data: session } = useSession();
  if (session && session.user) {
    return (
      <div className="flex flex-row gap-2 items-center">
        Signed in as {session.user.email} <br />
        <Button onClick={() => signOut()}>Sign out</Button>
      </div>
    );
  }
  return (
    <div className="flex flex-row gap-2 items-center">
      Not signed in <br />
      <Button onClick={() => signIn()}>Sign in</Button>
    </div>
  );
}
