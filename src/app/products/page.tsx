"use client";
import { useEffect, useState } from "react";
import TopBar from "@/components/ui/TopBar";
import BottomTabs from "@/components/ui/BottomTabs";
import AddProductModal from "@/components/products/AddProductModal";
import { DEFAULT_PANTRY_BASICS } from "@/lib/pantry";

type Item = {
  _id?: string; name: string; qty: number; unit: "g"|"ml"|"pcs";
  barcode?: string; brand?: string; image?: string;
  per100?: { kcal:number; protein:number; fat:number; carbs:number };
};

function kcalTotal(it: Item) {
  const p = it.per100 || { kcal:0, protein:0, fat:0, carbs:0 };
  const factor = (it.unit === "g" || it.unit === "ml") ? it.qty/100 : (it.qty || 1);
  return Math.round((p.kcal || 0) * factor);
}

export default function ProductsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showScan, setShowScan] = useState(false);

  // базовый набор
  const [useBasics, setUseBasics] = useState(true);
  const [basicsList, setBasicsList] = useState<string[]>([]);

  async function load() {
    const [inv, s] = await Promise.all([
      fetch("/api/inventory", { cache:"no-store" }).then(r=>r.json()),
      fetch("/api/settings", { cache:"no-store" }).then(r=>r.json()),
    ]);
    setItems(inv);
    setUseBasics(s?.usePantryBasics !== false);
    setBasicsList(Array.isArray(s?.pantryBasics) && s.pantryBasics.length ? s.pantryBasics : DEFAULT_PANTRY_BASICS);
  }
  useEffect(()=>{ load(); },[]);

  async function remove(id: string) {
    const r = await fetch(`/api/inventory/${id}`, { method:"DELETE" });
    if (r.ok) load();
  }
  async function toggleBasics(v:boolean){
    setUseBasics(v);
    await fetch("/api/settings", {
      method:"POST", headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ usePantryBasics: v })
    });
  }

  return (
    <>
      <TopBar />
      <div className="container-narrow section">
        <div className="d-flex align-items-center justify-content-between my-2">
          <h1 className="h5 m-0">Продукты</h1>
          <div className="btn-group">
            <button className="btn btn-outline-light btn-sm" onClick={()=>setShowScan(true)}>
              <i className="bi bi-upc-scan me-1" />Сканер
            </button>
            <button className="btn btn-brand btn-sm" onClick={()=>setShowAdd(true)}>
              <i className="bi bi-plus-lg me-1" />Добавить
            </button>
          </div>
        </div>

        {/* Базовый набор */}
        <div className="card frost round-2xl mb-3">
          <div className="card-body d-flex justify-content-between align-items-center">
            <div>
              <div className="fw-semibold">Базовый набор</div>
              <div className="small text-muted">
                {basicsList.slice(0, 8).join(", ")}{basicsList.length>8?"…":""}
              </div>
              <div className="small text-muted">Не учитывается как «не хватает» в рецептах</div>
            </div>
            <div className="form-check form-switch m-0">
              <input className="form-check-input" type="checkbox" checked={useBasics}
                     onChange={(e)=>toggleBasics(e.target.checked)} />
            </div>
          </div>
        </div>

        <ul className="list-group round-2xl overflow-hidden">
          {items.map(it=>(
            <li key={it._id} className="list-group-item bg-transparent text-white">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-3">
                  {it.image
                    ? <img src={it.image} alt="" width={56} height={56} className="rounded-3 object-fit-cover" />
                    : <div className="rounded-3 bg-dark-subtle" style={{width:56,height:56}} />
                  }
                  <div>
                    <div className="fw-medium">
                      {it.name} {it.brand && <span className="text-muted">• {it.brand}</span>}
                    </div>
                    <div className="small text-muted">
                      {it.qty} {it.unit} • {it.barcode ? `EAN ${it.barcode}` : "без штрих-кода"}
                    </div>
                    {it.per100 && (
                      <div className="small text-muted mt-1">
                        На 100 г: ккал {it.per100.kcal} • Б {it.per100.protein} • Ж {it.per100.fat} • У {it.per100.carbs}
                      </div>
                    )}
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="badge badge-soft">≈ {kcalTotal(it)} ккал</span>
                  <button className="btn btn-sm btn-outline-danger" onClick={()=>remove(it._id!)}>
                    <i className="bi bi-trash" />
                  </button>
                </div>
              </div>
            </li>
          ))}
          {items.length===0 && <li className="list-group-item bg-transparent text-muted text-center">Пока пусто.</li>}
        </ul>
      </div>
      <BottomTabs />

      {showAdd && <AddProductModal onClose={()=>setShowAdd(false)} onAdded={load} />}
      {showScan && <AddProductModal autoScan onClose={()=>setShowScan(false)} onAdded={load} />}
    </>
  );
}
