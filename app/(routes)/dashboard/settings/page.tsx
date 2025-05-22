"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/lib/supabaseClient";
import { content } from "@/context/language-content";

export default function SettingsPage() {
  const { setTheme, theme } = useTheme();
  const { language, setLanguage } = useLanguage();
const t=content[language]
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<null | {
    type: "success" | "error";
    text: string;
  }>(null);
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000); // 3 saniye

      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleThemeChange = (value: string) => {
    setTheme(value);
    setMessage({ type: "success", text: "Tema güncellendi." });
  };

  const handleLanguageChange = (value: "tr" | "en") => {
    setLanguage(value);
    setMessage({ type: "success", text: "Dil güncellendi." });
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Şifreler eşleşmiyor." });
      return;
    }

    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSaving(false);

    if (error) {
      setMessage({
        type: "error",
        text: "Şifre güncellenemedi: " + error.message,
      });
    } else {
      setMessage({ type: "success", text: "Şifre başarıyla güncellendi." });
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="p-4 max-w-2xl space-y-6">
      {/* Mesaj gösterimi */}
      {message && (
        <Alert
          variant={message.type === "success" ? "default" : "destructive"}
          className="flex items-start gap-4"
        >
          {message.type === "success" ? (
            <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600 mt-1" />
          )}
          <div>
            <AlertTitle>
              {message.type === "success" ? "Başarılı" : "Hata"}
            </AlertTitle>
            <AlertDescription>{message.text}</AlertDescription>
          </div>
        </Alert>
      )}

      {/* Tema Seçimi */}
      <Card>
        <CardHeader>
          <CardTitle>{ t.themeSelection}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
         
          <Select value={theme} onValueChange={handleThemeChange}>
            <SelectTrigger>
              <SelectValue placeholder={t.themeSelection} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">{ t.light}</SelectItem>
              <SelectItem value="dark">{ t.dark}</SelectItem>
              <SelectItem value="system">{ t.system}</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Dil Seçimi */}
      <Card>
        <CardHeader>
          <CardTitle>{t.languageSelection }</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
         
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger>
              <SelectValue placeholder={t.languageSelection} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tr">Türkçe</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Şifre Değiştirme */}
      <Card>
        <CardHeader>
          <CardTitle>{ t.changepassword}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label htmlFor="newPassword">{t.newPassword }</Label>
          <Input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <Label htmlFor="confirmPassword">{t.newPassword} ({t.again})</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button onClick={handleChangePassword} disabled={saving}>
    {t.change}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
