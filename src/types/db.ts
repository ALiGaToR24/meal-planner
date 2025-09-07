// src/types/db.ts
export type Nutr = { kcal:number; protein:number; fat:number; carbs:number };
export type Unit = "g"|"ml"|"pcs";

export type InventoryItem = {
  _id?: any; userId: string; name: string; qty: number; unit: Unit; barcode?: string;
};

export type Recipe = {
  _id?: any; userId: string;
  title: string; timeMin: number; image?: string;
  ingredients: { name: string; amount: number; unit: Unit; per100?: Nutr }[]; // per100 опционально
  steps: string[]; tags?: string[];
};

export type Meal = {
  _id?: any; userId: string; // план
  date: string; // "YYYY-MM-DD"
  time?: string; // "HH:mm"
  type: "breakfast"|"lunch"|"dinner"|"snack";
  recipeId: any; servings: number;
  eaten?: boolean; // отметка «съел»
};

export type Settings = {
  _id?: any; userId: string;
  dailyGoal?: Nutr; // цели БЖУ/ккал
  eatingWindows?: { day: number; // 0..6 (вс-пн)
                    allowed: { from: string; to: string; snacksOnly?: boolean }[] }[];
};
