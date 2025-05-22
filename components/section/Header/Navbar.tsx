"use client";

import Link from "next/link";
import { useState } from "react";
import { SiTransportforlondon } from "react-icons/si";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/important/ThemeToggle";
import LanguageSelector from "@/components/important/LanguageSelector";
import { useLanguage } from "@/context/LanguageContext";
import { content } from "@/context/language-content";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const { language } = useLanguage();
  const t = content[language];
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white dark:bg-black border-b border-black dark:border-gray-300 shadow-sm sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SiTransportforlondon className="text-black dark:text-white" />
          <span className="text-xl font-bold tracking-tight text-gray-800 dark:text-white">
            PortfoyPro
          </span>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/auth/login"
            className="text-sm font-medium text-white bg-black hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-colors px-4 py-2 rounded-md"
          >
            {t.signIn}
          </Link>

          <Link
            href="/auth/register"
            className="text-sm font-medium text-white bg-black hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-colors px-4 py-2 rounded-md"
          >
            {t.signUp}
          </Link>

          <LanguageSelector />
          <ThemeToggle />
        </div>

        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-800 dark:text-white"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}
    </header>
  );
}
