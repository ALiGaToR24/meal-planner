import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  if (!code) return NextResponse.json({ error: "code required" }, { status: 400 });

  const r = await fetch(`https://world.openfoodfacts.org/api/v2/product/${code}.json`, { next:{ revalidate: 3600 }});
  if (!r.ok) return NextResponse.json({ error:"lookup failed" }, { status: 502 });
  const data = await r.json();
  const p = data.product;
  if (!p) return NextResponse.json({ error:"not found" }, { status: 404 });

  const per100 = {
    kcal:   p.nutriments?.["energy-kcal_100g"] ?? 0,
    protein:p.nutriments?.["proteins_100g"] ?? 0,
    fat:    p.nutriments?.["fat_100g"] ?? 0,
    carbs:  p.nutriments?.["carbohydrates_100g"] ?? 0,
  };
  return NextResponse.json({
    name: p.product_name || p.generic_name || "Без названия",
    brand: p.brands || undefined,
    image: p.image_front_url || p.image_url || undefined,
    per100,
    unit: "g",
    code
  });
}
