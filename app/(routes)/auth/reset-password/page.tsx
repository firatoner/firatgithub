"use client";

import {  useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useLanguage } from "@/context/LanguageContext";
import { content } from "@/context/language-content";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const { language } = useLanguage();
  const t = content[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage(t.passwordsDoNotMatch);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setMessage(`${t.passwordResetError}: ${error.message}`);
    } else {
      setMessage(t.passwordResetSuccess);
      setTimeout(() => router.push("/auth/login"), 3000);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <Card className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-[600px] shadow-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-10 rounded-xl bg-white dark:bg-gray-900">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
            {t.resetPassword}
          </CardTitle>
          <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
            {t.resetPasswordInstructions}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <Label
                htmlFor="newPassword"
                className="text-gray-700 dark:text-gray-200"
              >
                {t.newPassword}
              </Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label
                htmlFor="confirmPassword"
                className="text-gray-700 dark:text-gray-200"
              >
                {t.newPasswordConfirm}
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            {message && (
              <p className="text-sm text-center text-red-500 dark:text-red-400">
                {message}
              </p>
            )}

            <Button type="submit" className="w-full text-base py-3 sm:py-4">
              {t.updatePassword}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
