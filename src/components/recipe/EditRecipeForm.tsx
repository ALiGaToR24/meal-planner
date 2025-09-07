"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Props = { id: string };

export default function EditRecipeForm({ id }: Props) {
  const router = useRouter();

  // ВСЕ хуки объявляем один раз, без условных возвратов между ними
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [timeMin, setTimeMin] = useState<number>(15);
  const [image, setImage] = useState("");
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [steps, setSteps] = useState<string[]>([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      const r = await fetch(`/api/recipes/${id}`, { cache: "no-store" });
      if (!r.ok) { alert("Рецепт не найден"); router.push("/recipes"); return; }
      const data = await r.json();
      if (!alive) return;
      setTitle(data.title || "");
      setTimeMin(data.timeMin ?? 15);
      setImage(data.image || "");
      setIngredients(Array.isArray(data.ingredients) ? data.ingredients : []);
      setSteps(Array.isArray(data.steps) ? data.steps : []);
      setLoading(false);
    })();
    return () => { alive = false; };
  }, [id, router]);

  async function save() {
    const body = { title, timeMin, image, ingredients, steps };
    const r = await fetch(`/api/recipes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (r.ok) router.push(`/recipes/${id}`);
    else alert("Ошибка сохранения");
  }

  if (loading) {
    return <p className="text-muted">Загрузка…</p>;
  }

  return (
    <div className="card frost round-2xl mb-3">
      <div className="card-body vstack gap-2">
        <input
          className="form-control"
          placeholder="Название"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="row g-2">
          <div className="col-6">
            <input
              className="form-control"
              placeholder="URL картинки"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </div>
          <div className="col-6">
            <input
              type="number"
              className="form-control"
              placeholder="Время, мин"
              value={timeMin}
              onChange={(e) => setTimeMin(+e.target.value)}
            />
          </div>
        </div>

        <div>
          <div className="fw-semibold mb-1">Ингредиенты</div>
          {ingredients.map((ing: any, i: number) => (
            <div key={i} className="row g-2 mb-1">
              <div className="col-6">
                <input
                  className="form-control"
                  placeholder="Название"
                  value={ing.name || ""}
                  onChange={(e) =>
                    setIngredients((arr) =>
                      arr.map((x, ix) => (ix === i ? { ...x, name: e.target.value } : x))
                    )
                  }
                />
              </div>
              <div className="col-3">
                <input
                  className="form-control"
                  placeholder="Кол-во"
                  value={ing.amount || ""}
                  onChange={(e) =>
                    setIngredients((arr) =>
                      arr.map((x, ix) => (ix === i ? { ...x, amount: e.target.value } : x))
                    )
                  }
                />
              </div>
              <div className="col-3">
                <select
                  className="form-select"
                  value={ing.unit || "g"}
                  onChange={(e) =>
                    setIngredients((arr) =>
                      arr.map((x, ix) => (ix === i ? { ...x, unit: e.target.value } : x))
                    )
                  }
                >
                  <option value="g">г</option>
                  <option value="ml">мл</option>
                  <option value="pcs">шт</option>
                </select>
              </div>
            </div>
          ))}
          <button
            className="btn btn-sm btn-outline-light"
            onClick={() => setIngredients([...ingredients, { name: "", amount: "", unit: "g" }])}
          >
            <i className="bi bi-plus-lg me-1" />
            Ингредиент
          </button>
        </div>

        <div>
          <div className="fw-semibold mb-1">Шаги</div>
          {steps.map((s, i) => (
            <div key={i} className="input-group mb-1">
              <span className="input-group-text">{i + 1}</span>
              <input
                className="form-control"
                value={s}
                onChange={(e) =>
                  setSteps((arr) => arr.map((x, ix) => (ix === i ? e.target.value : x)))
                }
              />
            </div>
          ))}
          <button
            className="btn btn-sm btn-outline-light"
            onClick={() => setSteps([...steps, ""])}
          >
            <i className="bi bi-plus-lg me-1" />
            Шаг
          </button>
        </div>

        <div className="d-grid mt-2">
          <button className="btn btn-brand" onClick={save}>
            <i className="bi bi-check2 me-1" />
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}
