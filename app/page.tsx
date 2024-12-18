import { Hero } from "./components/Hero";
import { Navbar } from "./components/Navbar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scoped Solutions - Energikartlegging",
  description: "Energikartlegging for eiendomsselskaper",
};

export default function Home() {
  return (
    <main className="bg-[#0D6E4f] min-h-screen mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl items-center justify-center mx-auto pt-32">
        <Navbar />
        <Hero />
      </div>
    </main>
  );
}

