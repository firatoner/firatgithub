
"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <select
      onChange={(e) => setLanguage(e.target.value as "tr" | "en")}
      value={language}
      className="border-2 px-2 py-1 text-sm bg-black text-white dark:bg-white dark:text-black rounded"
    >
      <option value="tr">Türkçe</option>
      <option value="en">English</option>
    </select>
  );
}
