import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { supabase } from "@/lib/supabaseClient";
// Giriş yapan kullanıcıyı getir
export async function getProfile() {
  const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/me`);
  if (!res.ok) throw new Error("Profil bilgisi alınamadı");
  return res.json(); // { id, fullName, email, baseCurrency }
}

// Kullanıcıyı güncelle (isim, para birimi)
export async function updateProfile(id: string, data: { fullName: string; baseCurrency: string }) {
  const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Profil güncellenemedi");
  return res.json();
}


export async function updateFullName(fullName: string) {
  const { error } = await supabase.auth.updateUser({
    data: {
      full_name: fullName,
    },
  });

  if (error) throw new Error(error.message);
}

