import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const body = await req.json();

  const {
    assetId,
    type,
    amount,
    unitPrice,
    currency,
    exchangeRate,
    totalPrice,
    totalPriceTry,
    transactionDate,
    note,
    platform,
    fee,
    isManual,
  } = body;

  const { data, error } = await supabase.from("transactions").insert([
    {
      assetId,
      type,
      amount,
      unitPrice,
      currency,
      exchangeRate,
      totalPrice,
      totalPriceTry,
      transactionDate,
      note,
      platform,
      fee,
      isManual,
    },
  ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}
