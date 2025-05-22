import { fetchWithAuth } from '@/lib/fetchWithAuth';

const BASE = `${process.env.NEXT_PUBLIC_API_BASE_URL}/portfolios`;

// GET /portfolios
export async function getMyPortfolios() {
  const res = await fetchWithAuth(BASE);
  if (!res.ok) throw new Error('Portföyler alınamadı');
  return res.json();
  
}

// POST /portfolios
export async function createPortfolio(name: string) {
  const res = await fetchWithAuth(BASE, {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error('Portföy oluşturulamadı');
  console.log("olusturlaamdi")
  return res.json();
}

// PUT /portfolios/{id}
export async function updatePortfolio(id: string, name: string) {
  const res = await fetchWithAuth(`${BASE}/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error('Portföy güncellenemedi');
  return res.json();
}

// DELETE /portfolios/{id}
export async function deletePortfolio(id: string) {
  const res = await fetchWithAuth(`${BASE}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Portföy silinemedi');
  return res.json();
}
