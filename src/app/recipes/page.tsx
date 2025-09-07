"use client";
import { useEffect, useMemo, useState } from "react";
import TopBar from "@/components/ui/TopBar";
import BottomTabs from "@/components/ui/BottomTabs";
import RecipeCard from "@/components/recipe/RecipeCard";
import { DEFAULT_PANTRY_BASICS } from "@/lib/pantry";

export default function RecipesPage(){
  const [tab, setTab] = useState<"all"|"byInv">("all");
  const [all, setAll] = useState<any[]>([]);
  const [byInv, setByInv] = useState<any[]>([]);
  const [inv, setInv] = useState<string[]>([]);
  const [settings, setSettings] = useState<any>(null);

  useEffect(()=>{ fetch("/api/recipes",{cache:"no-store"}).then(r=>r.json()).then(setAll); },[]);
  useEffect(()=>{ if(tab==="byInv") fetch("/api/recipes/by-inventory",{cache:"no-store"}).then(r=>r.json()).then(setByInv); },[tab]);
  useEffect(()=>{ fetch("/api/inventory",{cache:"no-store"}).then(r=>r.json()).then(arr=>setInv(arr.map((x:any)=>String(x.name).toLowerCase()))) },[]);
  useEffect(()=>{ fetch("/api/settings",{cache:"no-store"}).then(r=>r.json()).then(setSettings); },[]);

  const basics = useMemo(()=>{
    const enabled = settings?.usePantryBasics !== false;
    const list = Array.isArray(settings?.pantryBasics) && settings.pantryBasics.length
      ? settings.pantryBasics : DEFAULT_PANTRY_BASICS;
    return enabled ? list.map((x:string)=>x.toLowerCase()) : [];
  },[settings]);

  const haveSet = useMemo(()=> new Set([...inv, ...basics]), [inv, basics]);

  const list = tab==="all" ? all : byInv;
  const missing = (r:any) => (r.ingredients || [])
    .filter((i:any)=> !haveSet.has(String(i.name).toLowerCase()));

  return (
    <>
      <TopBar />
      <div className="container-narrow section">
        <div className="d-flex align-items-center justify-content-between my-2">
          <h1 className="h5 m-0">Рецепты</h1>
          <a className="btn btn-sm btn-brand" href="/recipes/new">
            <i className="bi bi-plus-lg me-1" />Добавить
          </a>
        </div>

        <ul className="nav nav-pills mb-3">
          <li className="nav-item">
            <button className={`nav-link ${tab==="all"?"active":""}`} onClick={()=>setTab("all")}>Все рецепты</button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${tab==="byInv"?"active":""}`} onClick={()=>setTab("byInv")}>
              Рецепты из имеющихся продуктов
            </button>
          </li>
        </ul>

        {/* одна карточка в строку */}
        <div className="vstack gap-3">
          {list.map((r:any)=>(
            <RecipeCard
              key={r._id}
              id={r._id}
              title={r.title}
              image={r.image}
              time={r.timeMin}
              tags={r.tags}
              showEdit
              missing={missing(r).map((i:any)=>i.name)}
            />
          ))}
          {list.length===0 && <p className="text-muted">Нет рецептов.</p>}
        </div>
      </div>
      <BottomTabs />
    </>
  );
}
