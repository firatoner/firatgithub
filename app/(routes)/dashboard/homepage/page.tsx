"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { getMyPortfolios } from "@/app/api/portfolios/route";
import { getAssetsByPortfolioId } from "@/lib/api/assets";
import AllPortfoliosPie from "@/components/dashboard/portfolio/AllPortfoliosPie";
import SinglePortfolioPie from "@/components/dashboard/portfolio/SinglePortfolioPie";
import { PortfolioCombobox } from "@/components/dashboard/portfolio/portfolio-combobox";
import { useLanguage } from "@/context/LanguageContext";
import { content } from "@/context/language-content";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [allAssets, setAllAssets] = useState<any[]>([]);
  const [selectedPortfolioAssets, setSelectedPortfolioAssets] = useState<any[]>(
    []
  );
  const [portfolios, setPortfolios] = useState([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<any>(null);
  const { language } = useLanguage();
  const t = content[language];


  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const data = await getMyPortfolios();
      setPortfolios(data);
      setSelectedPortfolio(data[0]);
    };
    load();
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/auth/login");
      } else {
        setUserEmail(session.user.email);
        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      const name = data?.user?.user_metadata?.full_name;
      if (name) setUserName(name);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchAllAssets = async () => {
      const portfolios = await getMyPortfolios();
      const allAssetsRaw = await Promise.all(
        portfolios.map((p: any) => getAssetsByPortfolioId(p.id))
      );
      const merged = allAssetsRaw.flat();

      const combined: Record<
        string,
        { symbol: string; amount: number; buyPrice: number }
      > = {};

      for (const asset of merged) {
        if (!combined[asset.symbol]) {
          combined[asset.symbol] = {
            symbol: asset.symbol,
            amount: Number(asset.amount),
            buyPrice: Number(asset.buyPrice),
          };
        } else {
          combined[asset.symbol].amount += Number(asset.amount);
        }
      }

      setAllAssets(Object.values(combined));
    };

    fetchAllAssets();
  }, []);

  useEffect(() => {
    if (!selectedPortfolio) return;
    const loadAssets = async () => {
      const data = await getAssetsByPortfolioId(selectedPortfolio.id);
      setSelectedPortfolioAssets(data);
    };
    loadAssets();
  }, [selectedPortfolio]);

  if (loading) return <p>{ t.loading}</p>;

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t.home}</h1>

        <p className="text-sm text-muted-foreground font-bold">
          {t.welcome} {userName}
        </p>
      </div>
      <div className="grid auto-rows-min gap-4 md:grid-cols-2">
        {/* 1. Kutu: Tüm Portföyler Grafiği */}
        <div className="min-h-[400px] rounded-xl bg-muted/50 p-4">
          <AllPortfoliosPie data={allAssets} />
        </div>

        {/* 2. Kutu: Seçili Portföy Grafiği + Combobox */}
        <div className="min-h-[400px] rounded-xl bg-muted/50 p-4 flex flex-col gap-4">
          <PortfolioCombobox
            portfolios={portfolios}
            selectedId={selectedPortfolio?.id}
            onChange={(id) => {
              const selected = portfolios.find((p) => p.id === id);
              setSelectedPortfolio(selected || null);
            }}
          />
          <div className="flex-1 flex items-center justify-center">
            <SinglePortfolioPie data={selectedPortfolioAssets} />
          </div>
        </div>
      </div>
      {/* 3. Kutu: Alt bölüm */}
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </>
  );
}
