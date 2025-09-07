"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TopNav({ email }: { email?: string }) {
  const path = usePathname();
  const items = [
    { href: "/", icon:"bi-house", label:"Главная" },
    { href: "/week", icon:"bi-calendar-week", label:"Неделя" },
    { href: "/recipes", icon:"bi-journal-text", label:"Рецепты" },
    { href: "/shopping", icon:"bi-bag-check", label:"Покупки" },
    { href: "/settings", icon:"bi-gear", label:"Настройки" },
  ];
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-glass sticky-top">
        <div className="container-narrow">
          <Link href="/" className="navbar-brand d-flex align-items-center gap-2">
            <span className="icon-dot"></span>
            <span className="fw-semibold">Meal Planner</span>
          </Link>

          <div className="d-flex align-items-center gap-3">
            <span className="d-none d-sm-inline text-muted small">{email}</span>
            <button className="btn btn-sm btn-outline-light" data-bs-toggle="offcanvas" data-bs-target="#menuOffcanvas">
              <i className="bi bi-list"></i>
            </button>
          </div>
        </div>
      </nav>

      {/* Offcanvas меню */}
      <div className="offcanvas offcanvas-end text-bg-dark" id="menuOffcanvas" tabIndex={-1}>
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">Меню</h5>
          <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas"></button>
        </div>
        <div className="offcanvas-body">
          {items.map(it=>(
            <Link key={it.href} href={it.href} className={`btn w-100 text-start mb-2 ${path===it.href?"btn-brand":"btn-outline-light"}`} data-bs-dismiss="offcanvas">
              <i className={`bi ${it.icon} me-2`}></i>{it.label}
            </Link>
          ))}
          <hr className="opacity-25"/>
          <form action="/api/auth/signout" method="post">
            <button className="btn btn-outline-danger w-100"><i className="bi bi-box-arrow-right me-2"></i>Выйти</button>
          </form>
        </div>
      </div>
    </>
  );
}
