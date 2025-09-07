"use client";
import { signOut } from "next-auth/react";

export default function SignOutButton({ className = "" }: { className?: string }) {
  return (
    <button
      className={className || "btn btn-outline-danger w-100"}
      onClick={() => signOut({ callbackUrl: "/login" })}
    >
      <i className="bi bi-box-arrow-right me-2" />
      Выйти
    </button>
  );
}
