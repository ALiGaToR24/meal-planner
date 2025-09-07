// root layout — безопасная замена твоего
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";
import Script from "next/script";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meal Planner",
  description: "Планировщик питания",
  viewport: { width: "device-width", initialScale: 1, viewportFit: "cover" },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" data-bs-theme="dark">
      <body className="min-vh-100 d-flex flex-column">
        {/* основной контент страниц */}
        <main className="flex-grow-1">{children}</main>

        {/* порталы для модалок/тостов при желании */}
        <div id="modal-root" />
        <div id="toast-root" />

        {/* Bootstrap JS — нужно для offcanvas, dropdown, modal */}
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
