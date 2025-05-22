"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { getAssetsByPortfolioId, updateOrCreateAsset } from "@/lib/api/assets";
import { getMyPortfolios } from "@/app/api/portfolios/route";
import { createTransaction } from "@/lib/api/transactions";
import { TransactionHistoryModal } from "./TransactionHistoryModal";
import { useLanguage } from "@/context/LanguageContext";
import { content } from "@/context/language-content";

type Portfolio = {
  id: string;
  name: string;
};

type Asset = {
  id: number;
  name: string;
  symbol: string;
};

export default function TransactionForm() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const {language} = useLanguage()
  const t=content[language]
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(
    null
  );
  const [assets, setAssets] = useState<Asset[]>([]);
  const [form, setForm] = useState({
    type: "buy",
    amount: "",
    unitPrice: "",
    currency: "USD",
    exchangeRate: "",
    transactionDate: "",
    note: "",
    platform: "",
    fee: "",
    assetId: "",
  });
  const [newAssetSymbol, setNewAssetSymbol] = useState("");
  const [addingNewAsset, setAddingNewAsset] = useState(false);
  const [newAssetCurrency, setNewAssetCurrency] = useState(form.currency || "TRY");

  useEffect(() => {
    async function fetchPortfolios() {
      try {
        const res = await getMyPortfolios();
        setPortfolios(res || []);
      } catch (err) {
        console.error("Portföyler alınamadı", err);
      }
    }
    fetchPortfolios();
  }, []);

  useEffect(() => {
    async function fetchAssets() {
      if (!selectedPortfolio) return;
      try {
        const res = await getAssetsByPortfolioId(Number(selectedPortfolio.id));
        console.log("API'dan gelen assetler:", res);
        setAssets(res || []);
      } catch (err) {
        console.error("Varlıklar alınamadı", err);
      }
    }
    fetchAssets();
  }, [selectedPortfolio]);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      const totalPrice = Number(form.amount) * Number(form.unitPrice);
      const totalPriceTry = totalPrice * Number(form.exchangeRate);
      let assetId = form.assetId;
      let assetSymbol = "";
      let assetName = "";
      // Eğer yeni varlık ekleniyorsa
      if ((assets.length === 0 || addingNewAsset) && newAssetSymbol) {
        // Asset'i oluştur
        const createdAsset = await updateOrCreateAsset({
          symbol: newAssetSymbol,
          type: "stock",
          amount: Number(form.amount),
          buyPrice: Number(form.unitPrice),
          currency: newAssetCurrency,
          note: form.note,
          portfolioId: Number(selectedPortfolio?.id),
          name: newAssetSymbol,
        }, assets);
        
        // Asset listesini güncelle ve assetId'yi bul
        const updatedAssets = await getAssetsByPortfolioId(Number(selectedPortfolio?.id));
        setAssets(updatedAssets);
        const found = updatedAssets.find((a: Asset) => a.symbol === newAssetSymbol);
        assetId = found ? String(found.id) : "";
        assetSymbol = newAssetSymbol;
        assetName = newAssetSymbol;
      } else {
        // Mevcut asset ile işlem
        const asset = assets.find((a: Asset) => String(a.id) === form.assetId);
        assetSymbol = asset?.symbol || asset?.name || "";
        assetName = asset?.name || asset?.symbol || "";
        // Asset miktarını güncelle
        if (asset) {
          await updateOrCreateAsset({
            symbol: assetSymbol,
            type: "stock",
            amount: Number(form.amount),
            buyPrice: Number(form.unitPrice),
            currency: form.currency,
            note: form.note,
            portfolioId: Number(selectedPortfolio?.id),
            name: assetName,
          }, assets);
        }
      }
      // Transaction'ı kaydet
      await createTransaction({
        ...form,
        assetId: Number(assetId),
        portfolioId: Number(selectedPortfolio?.id),
        amount: Number(form.amount),
        unitPrice: Number(form.unitPrice),
        exchangeRate: Number(form.exchangeRate),
        fee: Number(form.fee),
        totalPrice,
        totalPriceTry,
      });
      toast.success("İşlem başarıyla eklendi!");
      setForm((prev) => ({
        ...prev,
        amount: "",
        unitPrice: "",
        fee: "",
        note: "",
        assetId: assetId,
      }));
      setNewAssetSymbol("");
      setAddingNewAsset(false);
    } catch (erro) {
      toast.error("İşlem eklenemedi!");
    }
  };

  return (
    <>
    <div className="flex justify-end">
    <TransactionHistoryModal assets={assets} />
      </div>
    <div className="space-y-4 border p-4 rounded-xl shadow-lg bg-background">
     

      {/* Portföy seçimi */}
      <div>
        <Label></Label>
        <Select
          onValueChange={(val) => {
            const found = portfolios.find((p) => p.id === val);
            setSelectedPortfolio(found || null);
            setForm((prev) => ({ ...prev, assetId: "" }));
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder={t.selectPortfolio} />
          </SelectTrigger>
          <SelectContent>
            {portfolios.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

   
      {selectedPortfolio && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>{t.asset}</Label>
              {assets.length === 0 || addingNewAsset ? (
                <div className="flex gap-2 items-center">
                  <Input
                    placeholder="BIST100, AAPL, ..."
                    value={newAssetSymbol}
                    onChange={e => setNewAssetSymbol(e.target.value.toUpperCase())}
                    className="w-full"
                  />
                  <Select
                    value={newAssetCurrency}
                    onValueChange={setNewAssetCurrency}
                  >
                    <SelectTrigger className="w-24" />
                    <SelectContent>
                      <SelectItem value="TRY">TRY</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={async () => {
                      if (!newAssetSymbol) return;
                      const createdAsset = await updateOrCreateAsset({
                        symbol: newAssetSymbol,
                        type: "stock",
                        amount: Number(form.amount) || 0.0001,
                        buyPrice: Number(form.unitPrice) || 1,
                        currency: newAssetCurrency,
                        note: form.note,
                        portfolioId: Number(selectedPortfolio?.id),
                        name: newAssetSymbol,
                      }, assets);
                      // Asset listesini güncelle ve assetId'yi bul
                      const updatedAssets = await getAssetsByPortfolioId(Number(selectedPortfolio?.id));
                      setAssets(updatedAssets);
                      const found = updatedAssets.find((a: Asset) => a.symbol === newAssetSymbol);
                      if (found) {
                        setForm((prev) => ({ ...prev, assetId: String(found.id) }));
                      }
                      setAddingNewAsset(false);
                      setNewAssetSymbol("");
                    }}
                  >
                    Ekle
                  </Button>
                  {assets.length > 0 && (
                    <Button type="button" variant="ghost" onClick={() => { setAddingNewAsset(false); setNewAssetSymbol(""); }}>
                      {t.selectAsset}
                    </Button>
                  )}
                </div>
              ) : (
                <Select
                  value={form.assetId}
                  onValueChange={(val) => {
                    if (val === "__new__") {
                      setAddingNewAsset(true);
                      setNewAssetSymbol("");
                    } else {
                      handleChange("assetId", val);
                      setAddingNewAsset(false);
                      setNewAssetSymbol("");
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t.selectAsset}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {assets.map((a: Asset) => (
                      <SelectItem key={a.id} value={String(a.id)}>
                        {a.name || a.symbol}
                      </SelectItem>
                    ))}
                    <SelectItem value="__new__">
                      + Yeni Varlık Ekle
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>

            <div>
              <Label>{t.transactionType}</Label>
              <Select
                value={form.type}
                onValueChange={(val) => handleChange("type", val)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buy">{ t.buy}</SelectItem>
                  <SelectItem value="sell">{ t.sell}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>{ t.amount}</Label>
              <Input
                type="number"
                value={form.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
              />
            </div>

            <div>
              <Label>{ t.unitPrice}</Label>
              <Input
                type="number"
                value={form.unitPrice}
                onChange={(e) => handleChange("unitPrice", e.target.value)}
              />
            </div>

            <div>
              <Label>{ t.currency}</Label>
              <Select
                value={form.currency}
                onValueChange={(val) => handleChange("currency", val)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TRY">TRY</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>{ t.rate}(→ TRY)</Label>
              <Input
                type="number"
                value={form.exchangeRate}
                onChange={(e) => handleChange("exchangeRate", e.target.value)}
              />
            </div>

            <div>
              <Label>{ t.transactionDate}</Label>
              <Input
                type="datetime-local"
                value={form.transactionDate}
                onChange={(e) =>
                  handleChange("transactionDate", e.target.value)
                }
              />
            </div>

            <div>
              <Label>Platform</Label>
              <Input
                value={form.platform}
                onChange={(e) => handleChange("platform", e.target.value)}
              />
            </div>

            <div>
              <Label>{ t.transactionFee}</Label>
              <Input
                type="number"
                value={form.fee}
                onChange={(e) => handleChange("fee", e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>Not</Label>
            <Textarea
              value={form.note}
              onChange={(e) => handleChange("note", e.target.value)}
            />
          </div>

          <Button onClick={handleSubmit} className="w-full">
            {t.save}
          </Button>
        </>
      )}
    </div>
    </>
  );
}
