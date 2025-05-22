import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { assetId: string } }
) {
  const supabase = createClient();

  const assetId = Number(params.assetId);
  if (isNaN(assetId)) {
    return NextResponse.json({ error: "Geçersiz assetId" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("transaction")
    .select("*")
    .eq("assetId", assetId)
    .order("transactionDate", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
