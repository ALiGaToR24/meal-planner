"use client";
import { useEffect, useState } from "react";

export default function EditMealModal({
  meal, onClose, onSaved,
}: { meal: any; onClose: () => void; onSaved: () => void }) {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [form, setForm] = useState({ recipeId:"", type:"lunch", time:"13:00", servings:1 });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/recipes").then(r => r.json()).then(setRecipes);
    setForm({
      recipeId: meal.recipeId, type: meal.type, time: meal.time || "13:00", servings: meal.servings || 1,
    });
  }, [meal]);

  async function save(){
    if (busy) return;
    setBusy(true);
    const r = await fetch(`/api/meals/${meal._id}`, {
      method:"PATCH", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(form)
    });
    setBusy(false);
    if (!r.ok) { alert("Ошибка сохранения"); return; }
    onSaved(); onClose();
  }

  return (
    <div className="overlay-modal" onMouseDown={onClose}>
      <div className="modal-sheet" onMouseDown={(e)=>e.stopPropagation()}>
        <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
          <h5 className="m-0">Редактировать приём</h5>
          <button className="btn btn-sm btn-outline-light" onClick={onClose}><i className="bi bi-x-lg"/></button>
        </div>

        <div className="p-3 vstack gap-2">
          <select className="form-select" value={form.recipeId}
            onChange={e=>setForm(f=>({...f, recipeId: e.target.value}))}>
            {recipes.map((r:any)=><option key={r._id} value={r._id}>{r.title}</option>)}
          </select>
          <div className="row g-2">
            <div className="col-6">
              <select className="form-select" value={form.type}
                onChange={e=>setForm(f=>({...f, type: e.target.value}))}>
                <option value="breakfast">Завтрак</option>
                <option value="lunch">Обед</option>
                <option value="dinner">Ужин</option>
                <option value="snack">Перекус</option>
              </select>
            </div>
            <div className="col-3">
              <input className="form-control" value={form.time}
                onChange={e=>setForm(f=>({...f, time: e.target.value}))}/>
            </div>
            <div className="col-3">
              <input type="number" className="form-control" value={form.servings}
                onChange={e=>setForm(f=>({...f, servings: +e.target.value}))}/>
            </div>
          </div>
        </div>

        <div className="p-3 border-top d-flex justify-content-end gap-2">
          <button className="btn btn-outline-light" onClick={onClose}>Отмена</button>
          <button className="btn btn-brand" onClick={save} disabled={busy}>
            <i className="bi bi-check2 me-1"/>Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}
