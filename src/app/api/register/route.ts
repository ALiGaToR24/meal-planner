import { NextResponse } from "next/server";
import { db } from "@/lib/mongo";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: "Email и пароль обязательны" }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "Пароль слишком короткий" }, { status: 400 });
  }

  const dbo = await db();
  const users = dbo.collection("users");

  const existing = await users.findOne({ email });
  if (existing) {
    return NextResponse.json({ error: "Такой пользователь уже существует" }, { status: 400 });
  }

  const hash = await bcrypt.hash(password, 12);
  await users.insertOne({ email, passwordHash: hash, createdAt: new Date() });

  return NextResponse.json({ ok: true });
}
