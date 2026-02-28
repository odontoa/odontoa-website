"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Menu, X, Settings, LogOut } from "lucide-react";
import { Button } from "@/ui-lab/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui-lab/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui-lab/components/ui/dropdown-menu";
import { mockUser } from "@/ui-lab/mock-data";

interface HeaderProps {
  isOpen: boolean;
  onToggle: () => void;
}

const pageNames: Record<string, string> = {
  "/ui-lab": "",
  "/ui-lab/patients": "Pacijenti",
  "/ui-lab/dentists": "Doktori",
  "/ui-lab/appointments": "Kalendar",
  "/ui-lab/finance": "Finansije",
  "/ui-lab/settings": "Podešavanja",
  "/ui-lab/figma-dashboard": "Figma V2",
};

export default function Header({ isOpen, onToggle }: HeaderProps) {
  const pathname = usePathname();
  const isHomePage = pathname === "/ui-lab";
  const pageName = pageNames[pathname] || pathname.split("/").pop()?.replace("-", " ") || "";

  return (
    <header className="relative z-20 px-4 py-3 md:px-8 md:py-4 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="xl:hidden z-50">
          <Button
            onClick={onToggle}
            variant="ghost"
            className="p-3 bg-white rounded-xl shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            {isOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </Button>
        </div>
        {!isHomePage && (
          <Link
            href="/ui-lab"
            className="flex items-center text-gray-500 hover:text-blue-700 bg-white/70 border border-gray-200 rounded-xl px-3 py-1.5 shadow-sm transition-all backdrop-blur-md"
          >
            <ChevronLeft size={20} />
            <span className="ml-1 font-medium">Nazad</span>
          </Link>
        )}
        <h1 className="text-xl xl:text-2xl font-bold text-gray-900 ml-2 drop-shadow-sm">
          {pageName}
        </h1>
      </div>
      <div className="relative flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-10 w-10 rounded-full p-0 hover:bg-blue-50"
            >
              <Avatar className="h-10 w-10 bg-blue-600 text-white border-2 border-white shadow-sm">
                <AvatarImage src="" alt="Profile" />
                <AvatarFallback className="bg-blue-600 text-white font-semibold text-sm">
                  {mockUser.initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {mockUser.firstName} {mockUser.lastName}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {mockUser.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Podešavanja</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Odjavi se</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
