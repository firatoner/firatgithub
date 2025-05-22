"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { content } from "@/context/language-content";
import { ThemeToggle } from "@/components/important/ThemeToggle";
import LanguageSelector from "@/components/important/LanguageSelector";

interface MobileMenuProps {
  onClose: () => void;
}

export default function MobileMenu({ onClose }: MobileMenuProps) {
  const { language } = useLanguage();
  const t = content[language];

  return (
    <div className=" bg-white dark:bg-black border-t border-black dark:border-white  px-4 py-4 space-y-4">
      <Link
        href="/auth/login"
        className="block text-sm font-medium text-white bg-black hover:bg-gray-950 dark:bg-white dark:text-black dark:hover:bg-gray-300 transition-colors px-4 py-2 rounded-md"
        onClick={onClose}
      >
        {t.signIn}
      </Link>

      <Link
        href="/auth/register"
        className="block text-sm font-medium text-white bg-black hover:bg-gray-950 dark:bg-white dark:text-black dark:hover:bg-gray-300 transition-colors px-4 py-2 rounded-md"
        onClick={onClose}
      >
        {t.signUp}
      </Link>

      <div className="flex items-center justify-between">
        <LanguageSelector />
        <ThemeToggle />
      </div>
    </div>
  );
}
