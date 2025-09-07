"use client";
import { useEffect, useState } from "react";
import BarcodeScanner from "./BarcodeScanner";

export default function AddProductModal({
  onClose, onAdded, autoScan = false,
}: { onClose: () => void; onAdded: () => void; autoScan?: boolean }) {
  const [form, setForm] = useState({
    name: "", qty: 0, unit: "g", barcode: "", brand: "", image: "",
    per100: { kcal: 0, protein: 0, fat: 0, carbs: 0 },
  });
  const [scan, setScan] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (autoScan) setScan(true); }, [autoScan]);

  async function save() {
    setBusy(true);
    const r = await fetch("/api/inventory", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setBusy(false);
    if (!r.ok) {
      const e = await r.json().catch(() => ({}));
      alert(e.error || "Ошибка сохранения (проверь вход в аккаунт)");
      return;
    }
    await onAdded();
    onClose();
  }

  async function onDetected(code: string) {
    setScan(false);
    const r = await fetch(`/api/barcode?code=${code}`);
    const data = await r.json();
    if (r.ok) {
      setForm((f) => ({
        ...f,
        name: data.name || f.name,
        unit: data.unit || f.unit,
        barcode: code,
        brand: data.brand || "",
        image: data.image || "",
        per100: data.per100 || f.per100,
      }));
    } else {
      alert(data.error || "Не найдено");
      setForm((f) => ({ ...f, barcode: code }));
    }
  }

  return (
    <>
      <div className="backdrop-layer" onClick={onClose} />
      <div className="modal-layer" onClick={onClose}>
        <div className="modal-card" onClick={(e) => e.stopPropagation()}>
          <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
            <h5 className="m-0">Добавить продукт</h5>
            <button className="btn btn-sm btn-outline-light" onClick={onClose}>
              <i className="bi bi-x-lg" />
            </button>
          </div>

          <div className="p-3 vstack gap-2">
            <div className="input-group">
              <input
                className="form-control"
                placeholder="Штрих-код (сканируй или введи)"
                value={form.barcode}
                onChange={(e) => setForm({ ...form, barcode: e.target.value })}
              />
              <button className="btn btn-outline-light" onClick={() => setScan(true)}>
                <i className="bi bi-upc-scan" />
              </button>
            </div>

            <input className="form-control" placeholder="Название"
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />

            <div className="row g-2">
              <div className="col-5">
                <input type="number" className="form-control" placeholder="Количество"
                  value={form.qty} onChange={(e) => setForm({ ...form, qty: +e.target.value })} />
              </div>
              <div className="col-3">
                <select className="form-select" value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}>
                  <option value="g">г</option>
                  <option value="ml">мл</option>
                  <option value="pcs">шт</option>
                </select>
              </div>
              <div className="col-4">
                <input className="form-control" placeholder="Бренд"
                  value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
              </div>
            </div>

            <div className="row g-2">
              <div className="col-6"><input type="number" className="form-control" placeholder="Ккал/100"
                value={form.per100.kcal} onChange={(e) => setForm({ ...form, per100: { ...form.per100, kcal: +e.target.value } })} /></div>
              <div className="col-6"><input type="number" className="form-control" placeholder="Белки/100"
                value={form.per100.protein} onChange={(e) => setForm({ ...form, per100: { ...form.per100, protein: +e.target.value } })} /></div>
              <div className="col-6"><input type="number" className="form-control" placeholder="Жиры/100"
                value={form.per100.fat} onChange={(e) => setForm({ ...form, per100: { ...form.per100, fat: +e.target.value } })} /></div>
              <div className="col-6"><input type="number" className="form-control" placeholder="Углеводы/100"
                value={form.per100.carbs} onChange={(e) => setForm({ ...form, per100: { ...form.per100, carbs: +e.target.value } })} /></div>
            </div>
          </div>

          <div className="p-3 border-top d-flex justify-content-end gap-2">
            <button className="btn btn-outline-light" onClick={onClose}>Отмена</button>
            <button className="btn btn-brand" disabled={busy || !form.name || !form.qty} onClick={save}>
              <i className="bi bi-check2 me-1" />Сохранить
            </button>
          </div>
        </div>
      </div>

      {scan && <BarcodeScanner onDetected={onDetected} onClose={() => setScan(false)} />}
    </>
  );
}
