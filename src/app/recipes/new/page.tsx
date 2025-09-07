"use client";
import { useState } from "react";
import TopBar from "@/components/ui/TopBar";
import BottomTabs from "@/components/ui/BottomTabs";

type Ing = { name:string; amount:number; unit:"g"|"ml"|"pcs"; per100?: {kcal:number;protein:number;fat:number;carbs:number} };

export default function NewRecipePage(){
  const [title, setTitle] = useState("");
  const [timeMin, setTime] = useState(15);
  const [image, setImage] = useState("");
  const [steps, setSteps] = useState<string>("");
  const [tags, setTags] = useState("");
  const [ing, setIng] = useState<Ing[]>([{name:"",amount:0,unit:"g"}]);
  const [importUrl, setImportUrl] = useState("");

  async function onSubmit(e:React.FormEvent){
    e.preventDefault();
    const body = {
      title, timeMin, image,
      steps: steps.split("\n").map(s=>s.trim()).filter(Boolean),
      tags: tags.split(",").map(s=>s.trim()).filter(Boolean),
      ingredients: ing.filter(i=>i.name && i.amount>0)
    };
    const r = await fetch("/api/recipes",{ method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(body) });
    if(r.ok){ location.href="/recipes"; } else { alert("Ошибка сохранения"); }
  }

  async function importFromUrl(){
    if(!importUrl) return;
    const r = await fetch(`/api/recipes/import?url=${encodeURIComponent(importUrl)}`);
    const data = await r.json();
    if(!r.ok){ alert(data.error || "Не удалось импортировать"); return; }
    setTitle(data.title || "");
    setTime(data.timeMin || 15);
    setImage(data.image || "");
    setSteps((data.steps||[]).join("\n"));
    setTags((data.tags||[]).join(", "));
    setIng(data.ingredients || [{name:"",amount:0,unit:"g"}]);
  }

  return (
    <>
      <TopBar />
      <div className="container-narrow section">
        <h1 className="h5 my-3">Добавить рецепт</h1>

        <div className="card frost round-2xl mb-3">
          <div className="card-body">
            <div className="input-group mb-2">
              <input className="form-control" placeholder="Вставьте ссылку на рецепт (например, с TheMealDB)"
                     value={importUrl} onChange={e=>setImportUrl(e.target.value)} />
              <button className="btn btn-outline-light" onClick={importFromUrl}><i className="bi bi-download me-1"/>Импорт</button>
            </div>

            <form onSubmit={onSubmit} className="vstack gap-3">
              <input className="form-control" placeholder="Название" value={title} onChange={e=>setTitle(e.target.value)} />
              <div className="row g-2">
                <div className="col-4"><input type="number" className="form-control" placeholder="Время, мин" value={timeMin} onChange={e=>setTime(+e.target.value)} /></div>
                <div className="col-8"><input className="form-control" placeholder="URL картинки (опционально)" value={image} onChange={e=>setImage(e.target.value)} /></div>
              </div>

              <div>
                <div className="fw-semibold mb-2">Ингредиенты</div>
                {ing.map((x,idx)=>(
                  <div key={idx} className="row g-2 mb-2">
                    <div className="col-6"><input className="form-control" placeholder="Название" value={x.name} onChange={e=>setIng(v=>v.map((y,i)=>i===idx?{...y,name:e.target.value}:y))} /></div>
                    <div className="col-3"><input type="number" className="form-control" placeholder="Кол-во" value={x.amount} onChange={e=>setIng(v=>v.map((y,i)=>i===idx?{...y,amount:+e.target.value}:y))} /></div>
                    <div className="col-3">
                      <select className="form-select" value={x.unit} onChange={e=>setIng(v=>v.map((y,i)=>i===idx?{...y,unit:e.target.value as any}:y))}>
                        <option value="g">г</option><option value="ml">мл</option><option value="pcs">шт</option>
                      </select>
                    </div>
                  </div>
                ))}
                <button type="button" className="btn btn-sm btn-outline-light" onClick={()=>setIng(v=>[...v,{name:"",amount:0,unit:"g"}])}><i className="bi bi-plus-lg me-1"/>Ингредиент</button>
              </div>

              <div>
                <div className="fw-semibold mb-2">Шаги</div>
                <textarea className="form-control" rows={6} placeholder={"1. ...\n2. ..."} value={steps} onChange={e=>setSteps(e.target.value)} />
              </div>

              <input className="form-control" placeholder="Теги (через запятую)" value={tags} onChange={e=>setTags(e.target.value)} />

              <div className="d-grid">
                <button className="btn btn-brand" type="submit"><i className="bi bi-check2-circle me-1"/>Сохранить</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <BottomTabs />
    </>
  );
}
