"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import LoginButton from "@/components/login-button";
import { useSession } from "next-auth/react";

const LandingNavbar = () => {
  const { data: session } = useSession();

  const profileLink = session ? `/profile` : "/api/auth/signin";

  const listLink = session ? `/list-your-car` : "/api/auth/signin";

  return (
    <nav className="bg-gray-200 shadow-md h-20 flex items-center justify-between px-10">
      {/* Logo and Site Name */}
      <Link href="/" className="flex items-center">
        {/* <Image
          src="/mid-fi-proto.webp" // Replace with your logo's path
          width={70} // Adjust according to your logo's aspect ratio
          height={70} // Adjust according to your logo's aspect ratio
          alt="The Gym Advisors Logo"
        /> */}
        <span className="text-4xl font-semibold ml-3">🚗</span>
        <span className="text-xl font-semibold ml-3">Beep Beep</span>
      </Link>

      <Link href={profileLink}>User Profile</Link>
      <Link href={listLink}>List Your Car</Link>
      {/* Member check and Login button */}
      <div className="flex items-center">
        {/* <span className="text-lg mr-3">Already A Member?</span> */}
        <LoginButton />
      </div>
    </nav>
  );
};

export default LandingNavbar;
