"use client";
import TopBar from "@/components/ui/TopBar";
import BottomTabs from "@/components/ui/BottomTabs";
import { useEffect, useState } from "react";
import SubscribePushButton from "@/components/pwa/SubscribePushButton";
import TestPushButton from "@/components/pwa/TestPushButton";

type Nutr = { kcal: number; protein: number; fat: number; carbs: number };
type Window = { day: number; from: string; to: string; snacksOnly?: boolean };

export default function Settings() {
  const [goal, setGoal] = useState<Nutr>({
    kcal: 2200,
    protein: 140,
    fat: 70,
    carbs: 220,
  });
  const [before, setBefore] = useState(20);
  const [coverage, setCoverage] = useState(0.7);
  const [wins, setWins] = useState<Window[]>([]);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((s) => {
        if (s?.dailyGoal) setGoal(s.dailyGoal);
        if (s?.notifyBeforeMin != null) setBefore(s.notifyBeforeMin);
        if (s?.coverageThreshold != null) setCoverage(s.coverageThreshold);
        if (s?.eatingWindows) setWins(s.eatingWindows);
      });
  }, []);

  async function save() {
    const body = {
      dailyGoal: goal,
      notifyBeforeMin: before,
      coverageThreshold: coverage,
      eatingWindows: wins,
    };
    const r = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    alert(r.ok ? "Сохранено" : "Ошибка");
  }

  return (
    <>
      <TopBar />
      <main className="container-narrow section">
        <h1 className="h5 my-2">Настройки</h1>

        <div className="card frost round-2xl mb-3">
          <div className="card-body">
            <div className="fw-semibold mb-2">Дневная цель</div>
            <div className="row g-2">
              <div className="col-3">
                <input
                  className="form-control"
                  type="number"
                  value={goal.kcal}
                  onChange={(e) =>
                    setGoal((g) => ({ ...g, kcal: +e.target.value }))
                  }
                  placeholder="Ккал"
                />
              </div>
              <div className="col-3">
                <input
                  className="form-control"
                  type="number"
                  value={goal.protein}
                  onChange={(e) =>
                    setGoal((g) => ({ ...g, protein: +e.target.value }))
                  }
                  placeholder="Белки"
                />
              </div>
              <div className="col-3">
                <input
                  className="form-control"
                  type="number"
                  value={goal.fat}
                  onChange={(e) =>
                    setGoal((g) => ({ ...g, fat: +e.target.value }))
                  }
                  placeholder="Жиры"
                />
              </div>
              <div className="col-3">
                <input
                  className="form-control"
                  type="number"
                  value={goal.carbs}
                  onChange={(e) =>
                    setGoal((g) => ({ ...g, carbs: +e.target.value }))
                  }
                  placeholder="Углеводы"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card frost round-2xl mb-3">
          <div className="card-body">
            <div className="fw-semibold mb-2">Уведомления</div>
            <div className="row g-2 align-items-center">
              <div className="col-6">
                <label className="small text-muted">
                  За сколько минут напоминать
                </label>
              </div>
              <div className="col-6">
                <input
                  className="form-control"
                  type="number"
                  value={before}
                  onChange={(e) => setBefore(+e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card frost round-2xl mb-3">
          <div className="card-body">
            <div className="fw-semibold mb-2">Подбор рецептов</div>
            <label className="small text-muted">
              Минимальное покрытие ингредиентов
            </label>
            <input
              className="form-range w-100"
              type="range"
              min={0.3}
              max={1}
              step={0.05}
              value={coverage}
              onChange={(e) => setCoverage(+e.target.value)}
            />
            <div className="small text-muted">
              {Math.round(coverage * 100)}%
            </div>
          </div>
        </div>

        <div className="card frost round-2xl mb-3">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div className="fw-semibold">Окна приёма пищи</div>
              <button
                className="btn btn-sm btn-outline-light"
                onClick={() =>
                  setWins((w) => [...w, { day: 1, from: "09:00", to: "21:00" }])
                }
              >
                <i className="bi bi-plus-lg me-1" />
                Интервал
              </button>
            </div>
            {wins.map((w, idx) => (
              <div key={idx} className="row g-2 align-items-center mb-2">
                <div className="col-3">
                  <select
                    className="form-select"
                    value={w.day}
                    onChange={(e) =>
                      setWins((v) =>
                        v.map((x, i) =>
                          i === idx ? { ...x, day: +e.target.value } : x
                        )
                      )
                    }
                  >
                    {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((n, i) => (
                      <option value={i} key={i}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-3">
                  <input
                    className="form-control"
                    value={w.from}
                    onChange={(e) =>
                      setWins((v) =>
                        v.map((x, i) =>
                          i === idx ? { ...x, from: e.target.value } : x
                        )
                      )
                    }
                  />
                </div>
                <div className="col-3">
                  <input
                    className="form-control"
                    value={w.to}
                    onChange={(e) =>
                      setWins((v) =>
                        v.map((x, i) =>
                          i === idx ? { ...x, to: e.target.value } : x
                        )
                      )
                    }
                  />
                </div>
                <div className="col-2 form-check">
                  <input
                    id={`sn${idx}`}
                    className="form-check-input"
                    type="checkbox"
                    checked={!!w.snacksOnly}
                    onChange={(e) =>
                      setWins((v) =>
                        v.map((x, i) =>
                          i === idx ? { ...x, snacksOnly: e.target.checked } : x
                        )
                      )
                    }
                  />
                  <label
                    htmlFor={`sn${idx}`}
                    className="form-check-label small"
                  >
                    Только перекусы
                  </label>
                </div>
                <div className="col-1 text-end">
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() =>
                      setWins((v) => v.filter((_, i) => i !== idx))
                    }
                  >
                    <i className="bi bi-trash" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card frost round-2xl mb-3">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div className="fw-semibold">Окна приёма пищи</div>
              <div className="d-flex gap-2">
                <SubscribePushButton />
                <TestPushButton />
              </div>
            </div>
          </div>
        </div>

        <div className="d-grid">
          <button className="btn btn-brand" onClick={save}>
            <i className="bi bi-check2 me-1" />
            Сохранить
          </button>
        </div>
      </main>
      <BottomTabs />
    </>
  );
}
