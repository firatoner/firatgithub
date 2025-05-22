export async function getLiveExchangeRates() {
  const apiKey = process.env.NEXT_PUBLIC_OPENEXCHANGE_KEY;
  const res = await fetch(
    `https://openexchangerates.org/api/latest.json?app_id=${apiKey}`
  );

  const data = await res.json();
  console.log("💹 Döviz verisi:", data);

  if (!data?.rates?.EUR || !data?.rates?.TRY) {
    throw new Error("Beklenen döviz kurları bulunamadı");
  }

  return {
    USD: 1,
    EUR: data.rates.EUR,
    TRY: data.rates.TRY,
  };
}
