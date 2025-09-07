"use client";
import { useEffect, useState } from "react";
import BarcodeScanner from "@/components/products/BarcodeScanner";
import BottomTabs from "@/components/ui/BottomTabs";

type Item = { id:string; name:string; qty:number; unit:"g"|"ml"|"pcs"; barcode?:string };

const PANTRY: Item[] = [
  {id:"oats", name:"Овсяные хлопья", qty:500, unit:"g"},
  {id:"rice", name:"Рис", qty:1000, unit:"g"},
  {id:"milk", name:"Молоко", qty:1000, unit:"ml"},
  {id:"eggs", name:"Яйца", qty:10, unit:"pcs"},
  {id:"chicken", name:"Куриное филе", qty:800, unit:"g"},
];

export default function ProductsPage(){
  const [items, setItems] = useState<Item[]>([]);
  const [showScan, setShowScan] = useState(false);
  const [form, setForm] = useState({ name:"", qty:0, unit:"g" as Item["unit"] });

  useEffect(()=> {
    const raw = localStorage.getItem("inv");
    if (raw) setItems(JSON.parse(raw));
  }, []);
  useEffect(()=> {
    localStorage.setItem("inv", JSON.stringify(items));
  }, [items]);

  function addItem(newItem: Omit<Item,"id">){
    setItems(prev=> [{...newItem, id:crypto.randomUUID()}, ...prev]);
  }
  function remove(id:string){ setItems(prev=> prev.filter(i=>i.id!==id)); }
  function seedPantry(){ setItems(prev => [...PANTRY, ...prev]); }

  async function onBarcode(code:string){
    setShowScan(false);
    // Здесь можно сходить на свой API за продуктом по штрих-коду
    // const res = await fetch(`/api/products/by-barcode?code=${code}`);
    // const data = await res.json();
    addItem({ name:`Штрих-код ${code}`, qty:1, unit:"pcs", barcode:code });
  }

  return (
    <>
      <div className="container-narrow section">
        <div className="d-flex align-items-center justify-content-between my-2">
          <h1 className="h5 m-0">Продукты</h1>
          <div className="btn-group">
            <button className="btn btn-outline-light btn-sm" onClick={()=>setShowScan(true)}>
              <i className="bi bi-upc-scan me-1"/>Сканер
            </button>
            <button className="btn btn-brand btn-sm" onClick={seedPantry}>
              <i className="bi bi-stars me-1"/>Стартовый набор
            </button>
          </div>
        </div>

        {/* Форма ручного добавления */}
        <div className="card frost round-2xl mb-3">
          <div className="card-body">
            <div className="row g-2">
              <div className="col-6">
                <input className="form-control" placeholder="Название"
                       value={form.name} onChange={e=>setForm(s=>({...s, name:e.target.value}))}/>
              </div>
              <div className="col-3">
                <input className="form-control" type="number" placeholder="Кол-во"
                       value={form.qty} onChange={e=>setForm(s=>({...s, qty:+e.target.value}))}/>
              </div>
              <div className="col-3">
                <select className="form-select" value={form.unit} onChange={e=>setForm(s=>({...s, unit:e.target.value as any}))}>
                  <option value="g">г</option><option value="ml">мл</option><option value="pcs">шт</option>
                </select>
              </div>
              <div className="col-12 d-grid d-sm-block">
                <button className="btn btn-brand" onClick={()=>{
                  if(!form.name || !form.qty) return;
                  addItem({ name:form.name, qty:form.qty, unit:form.unit });
                  setForm({ name:"", qty:0, unit:"g" });
                }}>
                  <i className="bi bi-plus-lg me-1"/>Добавить
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Список */}
        <ul className="list-group round-2xl overflow-hidden">
          {items.map(it=>(
            <li key={it.id} className="list-group-item bg-transparent text-white d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-2">
                {it.barcode && <i className="bi bi-upc text-muted" title={it.barcode}/>}
                <span className="fw-medium">{it.name}</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-secondary-subtle text-white">{it.qty} {it.unit}</span>
                <button className="btn btn-sm btn-outline-light" onClick={()=>remove(it.id)}>
                  <i className="bi bi-trash" />
                </button>
              </div>
            </li>
          ))}
          {items.length===0 && (
            <li className="list-group-item bg-transparent text-muted text-center">Пока пусто. Добавь товары или отсканируй штрих-код.</li>
          )}
        </ul>

        {/* Подбор рецептов по тому, что есть */}
        <div className="my-3 d-grid">
          <a href="/recipes?suggest=1" className="btn btn-outline-light">
            <i className="bi bi-magic me-2"/>Показать рецепты из того, что есть
          </a>
        </div>
      </div>

      {showScan && <BarcodeScanner onDetected={onBarcode} onClose={()=>setShowScan(false)} />}
        <BottomTabs />
    </>
  );
}
