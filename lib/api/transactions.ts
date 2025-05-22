import { fetchWithAuth } from "../fetchWithAuth";

// Yeni bir işlem oluştur (buy/sell)
export async function createTransaction(data: any) {
  const res = await fetch("/api/transactions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
}

// Belirli bir asset'e ait işlemleri getir
export async function getTransactionsByAssetId(assetId: number) {
  const res = await fetchWithAuth(`/api/transactions/asset/${assetId}`);
  if (!res.ok) throw new Error("İşlemler alınamadı");
  
  const data = await res.json();

  // data bir array mi? emin ol
  if (!Array.isArray(data)) {
    console.error("Hatalı veri formatı:", data);
    return [];
  }

  return data;
}

// Tüm işlemleri getir
export async function getAllTransactions() {
  const res = await fetch("/api/transactions");
  if (!res.ok) throw new Error("İşlemler alınamadı");
  const data = await res.json();
  if (!Array.isArray(data)) {
    console.error("Hatalı veri formatı:", data);
    return [];
  }
  return data;
}
