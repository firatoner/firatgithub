"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/context/LanguageContext";
import { content } from "@/context/language-content";
import Link from "next/link";
import { PiKeyReturnFill } from "react-icons/pi";

export default function RegisterForm() {
  const router = useRouter();
  const { language } = useLanguage();
  const t = content[language];

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError(t.passwordsDoNotMatch);
      return;
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
        data: {
          full_name: fullname,
        },
      },
    });

    if (signUpError) {
      setError(`${t.registrationError}: ${signUpError.message}`);
      return;
    }

    router.push("/auth/verify-email");
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-0 flex justify-center items-center min-h-screen bg-white dark:bg-black transition-colors">
      <Card className="w-full max-w-[600px] shadow-lg border border-black dark:border-white p-10 rounded-xl bg-white dark:bg-black text-black dark:text-white transition-colors">
        <Link href="/">
          {" "}
          <PiKeyReturnFill size={35} />
        </Link>
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-center m-5">
            {t.signUp}
          </CardTitle>
          <CardDescription className="text-base text-center text-black dark:text-white">
            {t.signUpDescription}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleRegister}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">{t.fullName}</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Kemal Kılıçdaroğlu"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  required
                  className="bg-white dark:bg-black border-black dark:border-white text-black dark:text-white  placeholder:text-gray-500  transition-colors"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="deneme@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white dark:bg-black border border-black dark:border-white text-black dark:text-white placeholder:text-gray-500 transition-colors"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">{t.password}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white dark:bg-black border border-black dark:border-white text-black dark:text-white transition-colors"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">{t.passwordConfirm}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-white dark:bg-black border-black dark:border-white text-black dark:text-white transition-colors"
                />
              </div>

              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}

              <Button
                type="submit"
                className="w-full text-lg py-6 transition-all cursor-pointer hover:bg-gray-900 hover:text-white"
              >
                {t.signUp}
              </Button>
            </div>

            <div className="mt-6 text-center text-sm text-gray-700 dark:text-gray-300">
              {t.alreadyHaveAccount}{" "}
              <a
                href="/auth/login"
                className="underline underline-offset-4 font-semibold hover:text-black dark:hover:text-white"
              >
                {t.signIn}
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
