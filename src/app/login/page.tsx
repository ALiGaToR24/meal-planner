"use client";

import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

// если хочешь задать viewport именно на этой странице — используй отдельный export,
// НО обычно достаточно того, что уже в layout.tsx
// export const viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

function LoginInner() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const sp = useSearchParams();
  const router = useRouter();
  const callbackUrl = sp.get("callbackUrl") ?? "/";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl,
    });
    if (!res?.error) router.push(callbackUrl);
    else alert("Неверный логин или пароль");
  }

  return (
    <main className="min-vh-100 d-flex align-items-center justify-content-center p-4">
      <form onSubmit={onSubmit} className="w-100" style={{ maxWidth: 420 }}>
        <div className="card frost round-2xl">
          <div className="card-body p-4">
            <h1 className="h5 fw-semibold mb-3">Вход</h1>
            <div className="mb-3">
              <input
                className="form-control"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
              />
            </div>
            <div className="mb-3">
              <input
                className="form-control"
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            <button className="btn btn-brand w-100 mb-2" type="submit">
              Войти
            </button>
            <div className="text-center">
              <a className="text-decoration-none" href="/register">
                Нет аккаунта? Зарегистрируйтесь
              </a>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}

export default function LoginPage() {
  // ВАЖНО: оборачиваем компонент, где используется useSearchParams, в Suspense
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}

// Если вдруг Vercel продолжит ругаться на пререндеринг этой страницы,
// можно отключить статический пререндер, заставив её быть динамической:
// export const dynamic = "force-dynamic";
