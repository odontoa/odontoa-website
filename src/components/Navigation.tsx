'use client';

import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="w-full border-b border-[#262626] sticky top-0 z-50 bg-black">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <img 
                src="/odontoa-logo1.png" 
                alt="Odontoa Logo" 
                className="h-8 w-auto mr-3"
              />
              <div className="text-white font-bold text-xl">Odontoa</div>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/"
              className="text-white hover:text-[#4a9489] transition-colors text-sm font-medium"
            >
              Početna
            </Link>
            <Link 
              href="/o-nama"
              className="text-white hover:text-[#4a9489] transition-colors text-sm font-medium"
            >
              O nama
            </Link>
            <Link 
              href="/kontakt"
              className="text-white hover:text-[#4a9489] transition-colors text-sm font-medium"
            >
              Kontakt
            </Link>
            <Link 
              href="/blog"
              className="text-white hover:text-[#4a9489] transition-colors text-sm font-medium"
            >
              Blogovi
            </Link>
            <Link 
              href="/recnik"
              className="text-white hover:text-[#4a9489] transition-colors text-sm font-medium"
            >
              Rečnik
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-[#4a9489] transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="outline" size="sm" className="bg-[#1976D2] border border-[#1976D2] text-[#FFFFFF] hover:bg-[#1565C0] transition-colors duration-200 shadow-sm" style={{borderRadius: '8px'}}>
              Uloguj se
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-[#262626] py-4">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/"
                className="text-white hover:text-[#4a9489] transition-colors text-sm font-medium text-left"
                onClick={() => setIsMenuOpen(false)}
              >
                Početna
              </Link>
              <Link 
                href="/o-nama"
                className="text-white hover:text-[#4a9489] transition-colors text-sm font-medium text-left"
                onClick={() => setIsMenuOpen(false)}
              >
                O nama
              </Link>
              <Link 
                href="/kontakt"
                className="text-white hover:text-[#4a9489] transition-colors text-sm font-medium text-left"
                onClick={() => setIsMenuOpen(false)}
              >
                Kontakt
              </Link>
              <Link 
                href="/blog"
                className="text-white hover:text-[#4a9489] transition-colors text-sm font-medium text-left"
                onClick={() => setIsMenuOpen(false)}
              >
                Blogovi
              </Link>
              <Link 
                href="/recnik"
                className="text-white hover:text-[#4a9489] transition-colors text-sm font-medium text-left"
                onClick={() => setIsMenuOpen(false)}
              >
                Rečnik
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;