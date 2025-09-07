"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SignOutButton from "./auth/SignOutButton";

export default function TopBar({ email }: { email?: string }) {
  const p = usePathname();
  const title =
    p === "/" ? "Сегодня" :
    p?.startsWith("/week") ? "План на неделю" :
    p?.startsWith("/recipes") ? "Рецепты" :
    p?.startsWith("/products") ? "Продукты" :
    p?.startsWith("/settings") ? "Настройки" : "Meal Planner";

  return (
    <header className="topbar shadow-sm">
      <div className="container-narrow d-flex align-items-center gap-2">
        <Link href="/" aria-label="Домой" className="brand d-flex align-items-center gap-2 text-decoration-none">
          <span className="dot" />
          <span className="fw-semibold d-none d-sm-inline">Meal Planner</span>
        </Link>

        <div className="flex-grow-1 text-center">
          <div className="top-title text-truncate">{title}</div>
        </div>

        <div className="d-flex align-items-center gap-2">
          <Link href="/recipes" className="icon-btn" aria-label="Поиск рецептов">
            <i className="bi bi-search" />
          </Link>

          <div className="dropdown">
            <button className="icon-btn" data-bs-toggle="dropdown" aria-expanded="false" aria-label="Профиль">
              <i className="bi bi-person-circle" />
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow">
              {email && <li><span className="dropdown-item-text small text-muted">{email}</span></li>}
              <li><Link className="dropdown-item" href="/settings"><i className="bi bi-gear me-2"/>Настройки</Link></li>
              <li><hr className="dropdown-divider" /></li>
              <li><SignOutButton className="dropdown-item text-danger" /></li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
