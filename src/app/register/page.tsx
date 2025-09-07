"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    if (res.ok) {
      alert("Пользователь создан, теперь войдите!");
      router.push("/login");
    } else {
      const data = await res.json();
      alert(data.error || "Ошибка");
    }
  }

  return (
    <main className="min-h-screen grid place-items-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 border rounded-xl p-6">
        <h1 className="text-xl font-semibold">Регистрация</h1>
        <input className="w-full border rounded px-3 py-2"
               placeholder="Email"
               value={email}
               onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full border rounded px-3 py-2"
               type="password"
               placeholder="Пароль"
               value={password}
               onChange={(e) => setPassword(e.target.value)} />
        <button className="w-full bg-black text-white rounded py-2">
          Зарегистрироваться
        </button>
      </form>
    </main>
  );
}
