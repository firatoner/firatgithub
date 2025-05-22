import { fetchWithAuth } from "@/lib/fetchWithAuth";

const BASE = `${process.env.NEXT_PUBLIC_API_BASE_URL}/assets`;

// GET /assets/portfolio/{portfolioId}
export async function getAssetsByPortfolioId(portfolioId: number) {
  const res = await fetchWithAuth(`${BASE}/portfolio/${portfolioId}`);
  if (!res.ok) throw new Error("Varlıklar getirilemedi");
  return res.json();
}

// POST /assets
export async function createAsset(data: {
  symbol: string;
  type: string;
  amount: number;
  buyPrice: number;
  currency: string;
  note?: string;
  portfolioId: number;
  name: string;
}) {
  const res = await fetchWithAuth(`${BASE}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const text = await res.text();
  console.log("📤 Gönderilen veri:", data);
  console.log("📥 Backend'den gelen cevap:", text);

  if (!res.ok) {
    throw new Error("Varlık oluşturulamadı");
  }

  return JSON.parse(text);
}

// DELETE /assets/{id}
export async function deleteAsset(id: number) {
  const res = await fetchWithAuth(`${BASE}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("🛑 Silme hatası:", err);
    throw new Error("Varlık silinemedi");
  }

  return true;
}

// PUT /assets/{id}
export async function updateAsset(id: number, data: Partial<Asset>) {
  const res = await fetchWithAuth(`${BASE}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const text = await res.text();
  if (!res.ok) {
    console.error("🛑 Güncelleme hatası:", text);
    throw new Error("Varlık güncellenemedi");
  }

  return JSON.parse(text);
}

//varsa guncelle yoksa olustur
export async function updateOrCreateAsset(
  newAsset: Omit<Asset, "id">,
  existingAssets: Asset[]
) {
  const existing = existingAssets.find(
    (a) =>
      a.symbol === newAsset.symbol && a.portfolioId === newAsset.portfolioId
  );

  if (existing) {
    return await updateAsset(existing.id, {
      amount: Number(existing.amount) + Number(newAsset.amount),
    });
  } else {
    // yeni oluştur
    return await createAsset(newAsset);
  }
}
