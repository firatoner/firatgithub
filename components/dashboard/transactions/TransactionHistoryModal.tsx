"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getAllTransactions } from "@/lib/api/transactions";

type Transaction = {
  id: number;
  type: "buy" | "sell";
  amount: number;
  unitPrice: number;
  currency: string;
  transactionDate: string;
  platform?: string;
  fee?: number;
  note?: string;
};

export function TransactionHistoryModal({ assets }: { assets: { id: number; name?: string; symbol: string }[] }) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      getAllTransactions()
        .then(setTransactions)
        .catch(console.error);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">📜 Tüm Geçmiş İşlemler</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Tüm Geçmiş İşlemler</DialogTitle>
        </DialogHeader>

        {transactions.length === 0 ? (
          <p className="text-muted-foreground">Henüz işlem bulunmuyor.</p>
        ) : (
          <div className="overflow-auto max-h-[400px]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Varlık</th>
                  <th className="text-left p-2">Fiyat</th>
                  <th className="text-left p-2">Tür</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => {
                  const asset = assets.find((a) => a.id === tx.assetId);
                  return (
                    <tr key={tx.id} className="border-b hover:bg-muted">
                      <td className="p-2">{asset?.name || asset?.symbol || tx.assetId}</td>
                      <td className="p-2">{tx.unitPrice}</td>
                      <td className="p-2">{tx.type === "buy" ? "Alım" : "Satım"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
