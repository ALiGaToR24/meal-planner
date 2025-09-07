import { NextResponse } from "next/server";

// очень упрощённо: поддержим ?url=https://www.themealdb.com/meal/52772
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url") || "";
  const id = url.match(/(\d{5,})/)?.[1];
  if (!id) return NextResponse.json({ error: "Не удалось понять ID рецепта" }, { status: 400 });

  const r = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
  const data = await r.json();
  const meal = data.meals?.[0];
  if (!meal) return NextResponse.json({ error: "Рецепт не найден" }, { status: 404 });

  const ingredients = [];
  for (let i=1;i<=20;i++){
    const name = meal[`strIngredient${i}`];
    const measure = (meal[`strMeasure${i}`]||"").trim();
    if (!name) continue;
    // парсим просто количество и единицу по наитию
    const m = measure.match(/([\d\.]+)\s*(g|ml|шт|pcs)?/i);
    const amount = m ? parseFloat(m[1]) : 1;
    const unit = (m?.[2]?.toLowerCase() as any) || "pcs";
    ingredients.push({ name, amount, unit });
  }
  const steps = (meal.strInstructions || "").split("\n").map((s:string)=>s.trim()).filter(Boolean);

  return NextResponse.json({
    title: meal.strMeal,
    image: meal.strMealThumb,
    timeMin: 20,
    ingredients, steps,
    tags: (meal.strTags||"").split(",").filter(Boolean)
  });
}
