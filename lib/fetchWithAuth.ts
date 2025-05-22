import { supabase } from '@/lib/supabaseClient';

export async function fetchWithAuth(input: RequestInfo, init: RequestInit = {}) {
  const { data: { session } } = await supabase.auth.getSession();

  const token = session?.access_token;
  if (!token) {
    console.warn("Kullanıcı giriş yapmamış veya token eksik");
    throw new Error('Kullanıcı giriş yapmamış');


  }
      console.log("Token:", token);
console.log("İstek:", input);

  return fetch(input, {
    ...init,
    headers: {
      ...init.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
}
