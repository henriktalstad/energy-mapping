import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo.svg";
import { RainbowButton } from "@/components/ui/rainbow-button";

export function Navbar() {
  return (
    <div className="flex items-center justify-between py-5 h-20">
      <Link href="/" className="flex items-center gap-2">
        <Image src={Logo} alt="Logo" width={200} height={50} />
      </Link>
      <Link href="/login">
        <RainbowButton>Logg inn</RainbowButton>
      </Link>
    </div>  
  );
}
