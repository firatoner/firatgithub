"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useLanguage } from "@/context/LanguageContext";
import { content } from "@/context/language-content";
export default function AuthCallbackPage() {
  const router = useRouter();
  const { language } = useLanguage();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();
console.log(data)
      if (error) {
        console.error("Session alınamadı:", error.message);
        return;
      }

      router.push("/auth/login");
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600 text-sm">
        {content[language].loadingRedirectMessage ||
          "Giriş tamamlanıyor, lütfen bekleyin..."}
      </p>
    </div>
  );
}
