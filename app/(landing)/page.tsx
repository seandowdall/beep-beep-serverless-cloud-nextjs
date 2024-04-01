import LandingNavbar from "@/app/(landing)/_components/landing-navbar";
import Image from "next/image";
import LandingSearch from "./_components/landing-search";

export default function Home() {
  return (
    <main>
      <LandingNavbar />
      <LandingSearch />
    </main>
  );
}
