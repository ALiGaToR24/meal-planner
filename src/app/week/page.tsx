"use client";
import TopBar from "@/components/ui/TopBar";
import BottomTabs from "@/components/ui/BottomTabs";
import AddMealModal from "@/components/week/AddMealModal";
import EditMealModal from "@/components/week/EditMealModal";
import { useEffect, useMemo, useState } from "react";

function mondayOf(d: Date){ const x = new Date(d); const wd=(x.getDay()+6)%7; x.setDate(x.getDate()-wd); x.setHours(0,0,0,0); return x; }
function ymd(d: Date){ const z=new Date(d); z.setMinutes(z.getMinutes()-z.getTimezoneOffset()); return z.toISOString().slice(0,10); }

export default function WeekPage(){
  const [weekStart, setWeekStart] = useState(mondayOf(new Date()));
  const days = useMemo(()=> Array.from({length:7},(_,i)=>new Date(weekStart.getFullYear(),weekStart.getMonth(),weekStart.getDate()+i)), [weekStart]);

  const [meals, setMeals] = useState<any[]>([]);
  const [addDate, setAddDate] = useState<string|undefined>();
  const [editMeal, setEditMeal] = useState<any|null>(null);

  async function load(){
    const from = ymd(days[0]), to = ymd(days[6]);
    const list = await fetch(`/api/meals/range?from=${from}&to=${to}`).then(r=>r.json());
    setMeals(list);
  }
  useEffect(()=>{ load(); },[weekStart]);

  async function del(id:string){ await fetch(`/api/meals/${id}`,{ method:"DELETE" }); load(); }

  return (
    <>
      <TopBar />
      <main className="container-narrow section">
        <div className="d-flex justify-content-between align-items-center my-2">
          <h1 className="h5 m-0">План на неделю</h1>
          <div className="btn-group">
            <button className="btn btn-outline-light btn-sm" onClick={()=>setWeekStart(mondayOf(new Date(weekStart.getFullYear(),weekStart.getMonth(),weekStart.getDate()-7)))}><i className="bi bi-chevron-left"/></button>
            <button className="btn btn-outline-light btn-sm" onClick={()=>setWeekStart(mondayOf(new Date()))}>Сегодня</button>
            <button className="btn btn-outline-light btn-sm" onClick={()=>setWeekStart(mondayOf(new Date(weekStart.getFullYear(),weekStart.getMonth(),weekStart.getDate()+7)))}><i className="bi bi-chevron-right"/></button>
            <button className="btn btn-brand btn-sm" onClick={async()=>{ await fetch("/api/plan/autofill-week",{ method:"POST" }); load(); }}>
              <i className="bi bi-stars me-1"/>Заполнить неделю
            </button>
          </div>
        </div>

        <div className="vstack gap-3">
          {days.map((d,i)=>{
            const date = ymd(d);
            const dayMeals = meals.filter(m=>m.date===date);
            return (
              <div key={i} className="card frost round-2xl">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="fw-semibold">{["Пн","Вт","Ср","Чт","Пт","Сб","Вс"][i]} • {date}</div>
                    <button className="btn btn-sm btn-outline-light" onClick={()=>setAddDate(date)}>
                      <i className="bi bi-plus-lg me-1"/>Добавить
                    </button>
                  </div>
                  <div className="vstack gap-2">
                    {dayMeals.map(m=>(
                      <div key={m._id} className="d-flex justify-content-between align-items-center">
                        <div className="small">
                          <span className="text-muted text-uppercase me-2">{m.type}{m.time?` • ${m.time}`:""}</span>
                          <a className="link-light" href={`/recipes/${m.recipeId}`}>{m.recipeTitle || "Рецепт"}</a>
                        </div>
                        <div className="btn-group">
                          <button className="btn btn-sm btn-outline-light" onClick={()=>setEditMeal(m)}><i className="bi bi-pencil"/></button>
                          <button className="btn btn-sm btn-outline-danger" onClick={()=>del(m._id)}><i className="bi bi-trash"/></button>
                        </div>
                      </div>
                    ))}
                    {dayMeals.length===0 && <div className="text-muted small">Нет блюд</div>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <BottomTabs />

      {addDate && <AddMealModal date={addDate} onClose={()=>setAddDate(undefined)} onAdded={load} />}
      {editMeal && <EditMealModal meal={editMeal} onClose={()=>setEditMeal(null)} onSaved={load} />}
    </>
  );
}
