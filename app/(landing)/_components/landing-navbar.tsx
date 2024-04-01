import React from "react";
import Image from "next/image";
import Link from "next/link";

const LandingNavbar = () => {
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

      {/* Member check and Login button */}
      <div className="flex items-center">
        {/* <span className="text-lg mr-3">Already A Member?</span> */}
        <Link
          href="/login"
          className="bg-gray-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          Login
        </Link>
      </div>
    </nav>
  );
};

export default LandingNavbar;
