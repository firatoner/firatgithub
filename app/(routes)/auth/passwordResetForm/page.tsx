"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import { content } from "@/context/language-content";
import Link from "next/link";
import { PiKeyReturnFill } from "react-icons/pi";

export default function PasswordResetPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const { language } = useLanguage();
  const t = content[language];

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/auth/reset-password`,
    });

    if (error) {
      setMessage("Hata: " + error.message);
    } else {
      setMessage(t.passwordResetLinkSent);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black px-4">
      <Card className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-[600px] shadow-lg border border-gray-200 dark:border-white p-6 sm:p-10 rounded-xl bg-white dark:bg-black">
        <Link href="/">
          {" "}
          <PiKeyReturnFill size={35} />
        </Link>
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
            {t.resetPassword}
          </CardTitle>
          <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
            {t.resetPasswordDesc}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleReset} className="flex flex-col gap-5">
            <div>
              <Label
                htmlFor="email"
                className="text-gray-700 dark:text-gray-200"
              >
                {t.email}
              </Label>
              <br />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            {message && (
              <p className="text-sm text-center text-blue-600 dark:text-blue-400">
                {message}
              </p>
            )}

            <Button type="submit" className="w-full text-base py-3 sm:py-4">
              {t.sendResetLink}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
