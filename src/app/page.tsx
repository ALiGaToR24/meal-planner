"use client";
import TopBar from "@/components/ui/TopBar";
import BottomTabs from "@/components/ui/BottomTabs";
import StatCard from "@/components/ui/StatCard";
import RegisterPush from "@/components/pwa/RegisterPush";
import TestPushButton from "@/components/pwa/TestPushButton";
import { useEffect, useMemo, useState } from "react";

type Meal = { _id:string; type:string; time?:string; recipeId:string; servings:number; eaten?:boolean };
type Recipe = { _id:string; title:string; ingredients:any[]; image?:string };

export default function Today() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [recipes, setRecipes] = useState<Record<string, Recipe>>({});

  useEffect(()=>{
    (async ()=>{
      const [ms, rs] = await Promise.all([
        fetch("/api/meals/today").then(r=>r.json()),
        fetch("/api/recipes").then(r=>r.json())
      ]);
      setMeals(ms);
      setRecipes(Object.fromEntries(rs.map((r:any)=>[r._id, r])));
    })();
  },[]);

  async function toggleEaten(m: Meal, eaten: boolean){
    setMeals(prev=> prev.map(x=> x._id===m._id ? {...x, eaten} : x));
    await fetch("/api/meals/toggle-eaten",{ method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ mealId: m._id, eaten }) });
  }

  const totals = useMemo(()=>{
    const kcalFor = (rec?:Recipe)=>{
      if(!rec) return 0;
      return rec.ingredients.reduce((acc:any,ing:any)=>{
        if(!ing.per100) return acc;
        const factor = (ing.unit==="g"||ing.unit==="ml") ? ing.amount/100 : 1;
        return acc + (ing.per100.kcal||0)*factor;
      },0);
    };
    const eatenKcal = meals.filter(m=>m.eaten).reduce((s,m)=> s + kcalFor(recipes[m.recipeId]), 0);
    const plannedKcal = meals.reduce((s,m)=> s + kcalFor(recipes[m.recipeId]), 0);
    return { eatenKcal: Math.round(eatenKcal), plannedKcal: Math.round(plannedKcal) };
  },[meals, recipes]);

  return (
    <>
      <TopBar />
      <div className="container-narrow section">
        <div className="py-3 d-flex justify-content-between align-items-center">
          <div>
            <h1 className="h4 mb-1">Сегодня</h1>
            <div className="text-muted">Отмечай «Съел» — я посчитаю калории.</div>
          </div>
          <TestPushButton />
        </div>

        <div className="row g-3 mb-3">
          <div className="col-6 col-md-3"><StatCard title="Съедено" value={`${totals.eatenKcal}`} hint="ккал" /></div>
          <div className="col-6 col-md-3"><StatCard title="Запланировано" value={`${totals.plannedKcal}`} hint="ккал" /></div>
        </div>

        <div className="vstack gap-3">
          {meals.map(m=>{
            const r = recipes[m.recipeId];
            return (
              <div key={m._id} className="card frost round-2xl">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <div className="text-muted small text-uppercase">{m.type}{m.time?` • ${m.time}`:""}</div>
                    <div className="fw-semibold">{r?.title ?? "—"}</div>
                  </div>
                  <button className={`btn btn-sm ${m.eaten?"btn-brand":"btn-outline-light"}`} onClick={()=>toggleEaten(m, !m.eaten)}>
                    <i className="bi bi-check2-circle me-1"/>Съел
                  </button>
                </div>
              </div>
            );
          })}
          {meals.length===0 && <p className="text-muted">На сегодня ничего не запланировано.</p>}
        </div>
      </div>
      <BottomTabs />
      <RegisterPush />
    </>
  );
}
