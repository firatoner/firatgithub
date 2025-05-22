"use client";

import Link from "next/link";
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
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";
import { content } from "@/context/language-content";
import { PiKeyReturnFill } from "react-icons/pi";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { language } = useLanguage();
  const t = content[language];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const {
      data: { session },
      error,
    } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    console.log(session?.access_token);
    console.log(session?.refresh_token);

    if (error) {
      setError(`${t.loginFailed}: ${error.message}`);
      return;
    }

    router.push("/dashboard/homepage");
  };

  const handleOAuthLogin = async (provider: "google" | "facebook") => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${location.origin}/dashboard/homepage`,
      },
    });

    if (error) {
      setError(
        `${provider === "google" ? "Google" : "Facebook"} ${t.loginFailed}: ${
          error.message
        }`
      );
    }
  };

  return (
    <>
      <div className="w-full px-4 sm:px-6 lg:px-0 flex justify-center items-center min-h-screen bg-white dark:bg-black transition-colors">
        <Card className="w-full max-w-[600px] shadow-xl border border-black dark:border-white p-8 sm:p-10 rounded-xl bg-white dark:bg-black transition-colors">
          <Link href="/">
            {" "}
            <PiKeyReturnFill  size={35}/>
          </Link>

          <CardHeader>
            <CardTitle className="text-4xl font-bold text-center text-black dark:text-white">
              {t.signIn}
            </CardTitle>
            <CardDescription className="text-center text-base text-black dark:text-white mt-2">
              {t.signInDescription}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-black dark:text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="deneme@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white dark:bg-black text-black dark:text-white border border-black dark:border-white placeholder:text-gray-500 transition-colors "
                />
              </div>

              <div className="grid gap-2">
                <div className="flex justify-between items-center">
                  <Label
                    htmlFor="password"
                    className="text-black dark:text-white"
                  >
                    {t.password}
                  </Label>
                  <Link
                    href="/auth/passwordResetForm"
                    className="text-sm text-black dark:text-white font-medium hover:underline underline-offset-4"
                  >
                    {t.forgotPassword}
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white dark:bg-black text-black dark:text-white border border-black dark:border-white "
                />
              </div>

              <Button
                type="submit"
                className="w-full text-base py-4 bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition"
              >
                {t.signIn}
              </Button>

              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-2">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 justify-center w-full sm:w-auto hover:bg-black hover:text-white transition border-black"
                  type="button"
                  onClick={() => handleOAuthLogin("google")}
                >
                  <FaGoogle /> {t.signInWithGoogle}
                </Button>
                <Button
                  variant="blue"
                  className="flex items-center gap-2 justify-center w-full sm:w-auto border-black"
                  type="button"
                  onClick={() => handleOAuthLogin("facebook")}
                >
                  <FaFacebook /> {t.signInWithFacebook}
                </Button>
              </div>

              {error && (
                <p className="text-sm text-red-500 dark:text-red-400 text-center mt-4">
                  {error}
                </p>
              )}

              <div className="mt-6 text-center text-sm text-black dark:text-white">
                {t.noAccount}
                {"   "}
                <Link
                  href="/auth/register"
                  className="font-semibold text-black dark:text-white hover:underline underline-offset-4"
                >
                  {t.signUp}
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
