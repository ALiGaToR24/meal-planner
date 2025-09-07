"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomTabs(){
  const p = usePathname();
  const tabs = [
    {href:"/", icon:"bi-house", label:"Дом"},
    {href:"/week", icon:"bi-calendar-week", label:"Неделя"},
    {href:"/recipes", icon:"bi-journal-text", label:"Рецепты"},
    {href:"/products", icon:"bi-bag-check", label:"Продукты"},
    {href:"/settings", icon:"bi-gear", label:"Настройки"},
  ];
  return (
    <div className="bottom-nav py-2 d-md-none">
      <div className="container-narrow d-flex justify-content-between">
        {tabs.map(t=>(
          <Link key={t.href} href={t.href} className={`text-center flex-grow-1 ${p===t.href?"active":""}`}>
            <div><i className={`bi ${t.icon} fs-5`}></i></div>
            <small className="d-block">{t.label}</small>
          </Link>
        ))}
      </div>
    </div>
  );
}
