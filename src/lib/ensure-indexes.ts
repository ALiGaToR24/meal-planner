// src/lib/ensure-indexes.ts
import { db } from "@/lib/mongo";
let done = false;
export async function ensureIndexes() {
  if (done) return;
  const d = await db();
  await d.collection("users").createIndex({ email: 1 }, { unique: true });
  await d.collection("recipes").createIndex({ userId: 1, title: 1 });
  await d.collection("inventory").createIndex({ userId: 1, name: 1 });
  await d.collection("meals").createIndex({ userId: 1, date: 1 }); // расписание
  await d.collection("settings").createIndex({ userId: 1 }, { unique: true });
  done = true;
}
