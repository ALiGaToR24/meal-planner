"use client";

export default function ThemeToggle() {
  return (
    <div className="btn-group" role="group">
      <button
        className="btn btn-outline-light btn-sm"
        onClick={() => document.documentElement.setAttribute("data-bs-theme", "light")}
      >
        Светлая
      </button>
      <button
        className="btn btn-brand btn-sm"
        onClick={() => document.documentElement.setAttribute("data-bs-theme", "dark")}
      >
        Тёмная
      </button>
    </div>
  );
}
