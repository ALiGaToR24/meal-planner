import { NextResponse } from "next/server";
import { db } from "@/lib/mongo";
import { requireUserId } from "@/lib/auth-helpers";
import { DEFAULT_PANTRY_BASICS } from "@/lib/pantry";

export const dynamic = "force-dynamic";

export async function GET() {
  const userId = await requireUserId();
  const dbo = await db();

  const [recipes, inventory, settings] = await Promise.all([
    dbo.collection("recipes").find({ userId }).toArray(),
    dbo.collection("inventory").find({ userId }).project({ name:1 }).toArray(),
    dbo.collection("settings").findOne({ userId }),
  ]);

  const invNames = inventory.map((i:any)=> String(i.name).toLowerCase());
  const basicsEnabled = settings?.usePantryBasics !== false;
  const basics = basicsEnabled && Array.isArray(settings?.pantryBasics) && settings!.pantryBasics!.length
    ? settings!.pantryBasics!.map((x:string)=>x.toLowerCase())
    : (basicsEnabled ? DEFAULT_PANTRY_BASICS.map(x=>x.toLowerCase()) : []);

  const have = new Set([...invNames, ...basics]);
  const threshold = typeof settings?.coverageThreshold === "number" ? settings.coverageThreshold : 0.7;

  const filtered = recipes.filter((r:any) => {
    const ings = (r.ingredients || []).filter((i:any)=> i?.name);
    if (!ings.length) return false;
    const present = ings.filter((i:any)=> have.has(String(i.name).toLowerCase())).length;
    const coverage = present / ings.length;
    return coverage >= threshold;
  });

  return NextResponse.json(filtered);
}
