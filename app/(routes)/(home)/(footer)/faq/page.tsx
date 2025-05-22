"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import { content } from "@/context/language-content";

export default function FAQPage() {
  const { language } = useLanguage();
  const t = content[language].footer.faq;

  return (
    <div className="min-h-[calc(100dvh-64px)] flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-foreground">{t.title}</CardTitle>
        </CardHeader>
        <CardContent className="text-foreground">
          <Accordion type="single" collapsible className="w-full">
            {t.items.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent>{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
