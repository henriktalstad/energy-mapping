import { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { DashboardLinks } from "../components/DashboardLinks";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, User2, Building, BarChart2, FileText } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "../utils/auth";
import { Toaster } from "@/components/ui/sonner";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr] lg:grid-cols-[300px_1fr]">
        <div className="hidden border-r bg-gradient-to-b from-emerald-800 to-emerald-950 text-white md:block">
          <div className="flex flex-col max-h-screen h-full gap-2">
            <div className="h-20 flex items-center justify-center border-b border-emerald-700 px-4 lg:h-[100px] lg:px-6">
              <Image src="/logo.svg" alt="Scoped Solutions Logo" height={50} width={200} />
            </div>
            <div className="flex-1 overflow-auto">
              <nav className="grid items-start px-4 text-sm font-medium space-y-2 py-4">
                <Link href="/dashboard" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                  <Building className="h-5 w-5" />
                  <span>Bygninger</span>
                </Link>
                <Link href="/dashboard/projects" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                  <BarChart2 className="h-5 w-5" />
                  <span>Energikartlegging</span>
                </Link>
                <Link href="/dashboard/reports" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                  <FileText className="h-5 w-5" />
                  <span>Rapporter</span>
                </Link>
                <DashboardLinks />
              </nav>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-emerald-800 text-white px-4 lg:h-[60px] lg:px-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-white">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-emerald-800 text-white">
                <nav className="grid gap-4 mt-10">
                  <Link href="/dashboard" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                    <Building className="h-5 w-5" />
                    <span>Bygninger</span>
                  </Link>
                  <Link href="/dashboard/projects" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                    <BarChart2 className="h-5 w-5" />
                    <span>Energikartlegging</span>
                  </Link>
                  <Link href="/dashboard/reports" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                    <FileText className="h-5 w-5" />
                    <span>Rapporter</span>
                  </Link>
                  <DashboardLinks />
                </nav>
              </SheetContent>
            </Sheet>

            <div className="flex items-center ml-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="rounded-full"
                    variant="ghost"
                    size="icon"
                  >
                    <User2 className="h-5 w-5 text-white" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Min konto</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Oversikt</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile">Profil</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings">Innstillinger</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <form
                      className="w-full"
                      action={async () => {
                        "use server";
                        await signOut();
                      }}
                    >
                      <button className="w-full text-left">Logg ut</button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex-1 overflow-auto bg-white">
            <div className="container mx-auto py-6 px-4 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
      <Toaster richColors closeButton theme="light" />
    </>
  );
}

