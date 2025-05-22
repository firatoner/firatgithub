"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getAssetsByPortfolioId,
  createAsset,
  deleteAsset,
  updateAsset,
} from "@/lib/api/assets";
import { getLiveExchangeRates } from "@/lib/api/exchange";
import { updateOrCreateAsset } from "@/lib/api/assets";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaTrash } from "react-icons/fa";
import { Pencil } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useLanguage } from "@/context/LanguageContext";
import { content } from "@/context/language-content";

type Asset = {
  id: number;
  symbol: string;
  type: string;
  amount: number;
  buyPrice: number | string;
  portfolioId: number;
};

export default function AssetsPage() {
  const { id: portfolioId } = useParams();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [editAmount, setEditAmount] = useState<number>(0);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [exchangeRates, setExchangeRates] = useState<any>(null);
  const [selected, setSelected] = useState<{ [key: string]: boolean }>({});
  const [amounts, setAmounts] = useState<{ [key: string]: number }>({});
  const { language } = useLanguage():
  const t = content[language];

  useEffect(() => {
    if (!portfolioId) return;

    getAssetsByPortfolioId(portfolioId)
      .then(setAssets)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [portfolioId]);

  const handleLiveAssetModalOpen = async () => {
    try {
      const rates = await getLiveExchangeRates();
      setExchangeRates(rates);
      setDialogOpen(true);
    } catch (err) {
      console.error(err);
      setError("Kur verileri alınırken hata oluştu.");
    }
  };

  const handleCreateSelectedAssets = async () => {
    try {
      const entries = Object.entries(selected).filter(([_, v]) => v);

      const existing = await getAssetsByPortfolioId(portfolioId);
      const getBuyPrice = (code: string) => {
        if (code === "USD") return exchangeRates.TRY;
        if (code === "EUR") return exchangeRates.TRY / exchangeRates.EUR;
        return 1; // TRY
      };

      for (const [code] of entries) {
        await updateOrCreateAsset(
          {
            symbol: code,
            type: "currency",
            amount: amounts[code] || 1,
            buyPrice: getBuyPrice(code), // ✅ TL bazlı
            currency: "TRY", // ✅ Ana para birimi TL
            note: "",
            portfolioId: Number(portfolioId),
          },
          existing
        );
      }

      const updated = await getAssetsByPortfolioId(Number(portfolioId));
      setAssets(updated);
      setDialogOpen(false);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Seçilen varlıklar eklenemedi.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteAsset(id);
      const updated = await getAssetsByPortfolioId(Number(portfolioId));
      setAssets(updated);
    } catch (err) {
      console.error(err);
      setError("Varlık silinemedi.");
    }
  };

  const handleEdit = (asset: Asset) => {
    setEditingAsset(asset);
    setEditAmount(asset.amount);
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const rates = await getLiveExchangeRates();
        setExchangeRates(rates);
      } catch (err) {
        console.error("Kur verisi alınamadı", err);
      }
    };

    fetchRates();
  }, []);

  function convertToTRY(asset: Asset, rates: any): number {
    const amount = Number(asset.amount);
    const buyPrice = Number(asset.buyPrice);

    if (!rates) return 0;

    switch (asset.currency) {
      case "TRY":
        return amount * buyPrice;
      case "USD":
        return amount * buyPrice * rates.TRY;
      case "EUR":
        return amount * buyPrice * rates.TRY; 
      default:
        return 0;
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">{t.assets}</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <p>{ t.loading}</p>
      ) : (
        <>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mb-4" onClick={handleLiveAssetModalOpen}>
               {t.addAsset}
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                  <DialogTitle>{ t.wantToAdd}</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {["USD", "EUR", "TRY"].map((code) => (
                  <div key={code} className="flex items-center gap-4">
                    <Checkbox
                      id={code}
                      checked={selected[code] || false}
                      onCheckedChange={(checked) =>
                        setSelected((prev) => ({ ...prev, [code]: !!checked }))
                      }
                    />
                    <label htmlFor={code} className="w-12">
                      {code}
                    </label>
                    <span className="text-sm text-gray-500">
                      {code === "USD" &&
                        exchangeRates?.TRY?.toLocaleString("tr-TR", {
                          style: "currency",
                          currency: "TRY",
                        })}
                      {code === "EUR" &&
                        (
                          exchangeRates?.TRY / exchangeRates?.EUR
                        )?.toLocaleString("tr-TR", {
                          style: "currency",
                          currency: "TRY",
                        })}
                      {code === "TRY" &&
                        (1).toLocaleString("tr-TR", {
                          style: "currency",
                          currency: "TRY",
                        })}
                    </span>

                    <Input
                      type="number"
                      placeholder={t.amount}
                      className="w-24"
                      value={amounts[code] || ""}
                      onChange={(e) =>
                        setAmounts((prev) => ({
                          ...prev,
                          [code]: Number(e.target.value),
                        }))
                      }
                    />
                  </div>
                ))}

                <Button
                  className="w-full mt-2"
                  onClick={handleCreateSelectedAssets}
                >
                {t.addSelectedAssets}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {assets.length === 0 ? (
              <p>{ t.thereNoAssets}</p>
          ) : (
            <ul className="space-y-2">
              {assets.map((a) => (
                <li
                  key={a.id}
                  className="p-2 border rounded flex justify-between items-center"
                >
                  <div>
                    <div className="font-semibold">{a.symbol}</div>
                    <div className="text-sm text-gray-500">
                      {Number(a.amount).toLocaleString("tr-TR", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      })}
                      {a.symbol === "USD"
                        ? "$"
                        : a.symbol === "EUR"
                        ? "€"
                        : "₺"}{" "}
                      ={" "}
                      {convertToTRY(a, exchangeRates).toLocaleString("tr-TR", {
                        style: "currency",
                        currency: "TRY",
                      })}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(a)}
                    >
                      <Pencil />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <FaTrash />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                           {t.deleteAsset}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {t.deleteAssetDescription}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{ t.cancel}</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(a.id)}>
                           {t.yesDelete}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Düzenleme Modalı */}
          <Dialog
            open={!!editingAsset}
            onOpenChange={() => setEditingAsset(null)}
          >
            <DialogContent>
              <DialogHeader>
                  <DialogTitle>{ t.editAsset}</DialogTitle>
              </DialogHeader>

              {editingAsset && (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      {editingAsset.symbol} – {editingAsset.type}
                    </p>
                  </div>

                  <Input
                    type="number"
                    value={editAmount}
                    onChange={(e) => setEditAmount(Number(e.target.value))}
                  />

                  <Button
                    onClick={async () => {
                      try {
                        await updateAsset(editingAsset.id, {
                          amount: editAmount,
                        });
                        const updated = await getAssetsByPortfolioId(
                          portfolioId
                        );
                        setAssets(updated);
                        setEditingAsset(null);
                      } catch (err) {
                        console.error(err);
                        setError("Güncelleme başarısız.");
                      }
                    }}
                  >
                   {t.save}
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
