"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import { content } from "@/context/language-content";

export default function GuidesPage() {
  const { language } = useLanguage();
  const t = content[language].footer.guides;

  return (
    <div className="min-h-[calc(100dvh-64px)] flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-foreground">{t.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-foreground text-sm leading-relaxed">
          <ul className="list-disc list-inside space-y-2">
            {t.items.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
