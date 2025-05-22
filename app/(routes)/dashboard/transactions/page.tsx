"use client";

import { useEffect, useState } from "react";
import TransactionForm from "@/components/dashboard/transactions/TransactionForm";
import { getMyPortfolios } from "@/app/api/portfolios/route";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import { content } from "@/context/language-content";

export default function TransactionsPage() {
  const [portfolio, setPortfolio] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const t = content[language];
  useEffect(() => {
    async function loadPortfolio() {
      try {
        const portfolios = await getMyPortfolios();
        setPortfolio(portfolios[0]);
      } catch (error) {
        console.error("Portföy alınamadı:", error);
      } finally {
        setLoading(false);
      }
    }

    loadPortfolio();
  }, []);

  if (loading) return <div className="p-6">{t.loading}</div>;

  if (!portfolio) {
    return (
      <Card className="m-6">
        <CardHeader>
          <CardTitle>{ t.noPortfolio}</CardTitle>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">{ t.transactionAdd}</h1>
      <TransactionForm
        portfolioId={portfolio.id}
        portfolioName={portfolio.name}
      />
    </div>
  );
}
