"use client";

import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import { content } from "@/context/language-content";

export default function ContactPage() {
  const { language } = useLanguage();
  const t = content[language].footer.contact;

  return (
    <div className="min-h-[calc(100dvh-64px)] flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-foreground">{t.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-foreground">
          <div className="flex items-start gap-4">
            <Mail className="text-primary mt-1" />
            <div>
              <p className="font-medium">{t.emailLabel}</p>
              <a
                href="mailto:info@portfoypro.com"
                className="hover:underline text-sm text-blue-500 dark:text-blue-400"
              >
                info@portfoypro.com
              </a>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Phone className="text-primary mt-1" />
            <div>
              <p className="font-medium">{t.phoneLabel}</p>
              <p className="text-sm">+90 (212) 123 45 67</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <MapPin className="text-primary mt-1" />
            <div>
              <p className="font-medium">{t.addressLabel}</p>
              <p className="text-sm">
                Barbaros Mah. İnönü Cad. No:34, Beşiktaş / İstanbul
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Clock className="text-primary mt-1" />
            <div>
              <p className="font-medium">{t.hoursLabel}</p>
              <p className="text-sm">{t.hours}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
