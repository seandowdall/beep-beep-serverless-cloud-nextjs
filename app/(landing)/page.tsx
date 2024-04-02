import LandingNavbar from "@/app/(landing)/_components/landing-navbar";
import Image from "next/image";
import LandingSearch from "./_components/landing-search";
import DisplayAllCards from "./_components/display-all-cards";

export default function Home() {
  return (
    <main>
      <LandingNavbar />
      <LandingSearch />
      <div className="p-10 flex flex-col space-y-5">
        <h1 className="text-3xl font-medium">Available Cars:</h1>
        <DisplayAllCards />
      </div>
    </main>
  );
}
