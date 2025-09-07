import { NextResponse } from "next/server";
import { db } from "@/lib/mongo";
import { requireUserId } from "@/lib/auth-helpers";
import { addDays, startOfWeek, format } from "date-fns";

const MEAL_TYPES = ["breakfast","lunch","dinner"] as const;

export async function POST() {
  const userId = await requireUserId();
  const d = await db();
  const recipes = await d.collection("recipes").find({ userId }).toArray();
  if (!recipes.length) return NextResponse.json({ error:"Нет рецептов" }, { status:400 });

  const monday = startOfWeek(new Date(), { weekStartsOn: 1 });
  const toInsert:any[] = [];

  for (let day=0; day<7; day++){
    const date = format(addDays(monday, day), "yyyy-MM-dd");
    for (const type of MEAL_TYPES){
      const r = recipes[Math.floor(Math.random()*recipes.length)];
      const time = type==="breakfast"?"08:00":type==="lunch"?"13:00":"19:00";
      toInsert.push({ userId, date, type, recipeId: r._id, time, servings:1, eaten:false });
    }
  }
  await d.collection("meals").deleteMany({ userId, date: { $gte: format(monday,"yyyy-MM-dd"), $lte: format(addDays(monday,6),"yyyy-MM-dd") } });
  await d.collection("meals").insertMany(toInsert);
  return NextResponse.json({ ok:true, count: toInsert.length });
}
