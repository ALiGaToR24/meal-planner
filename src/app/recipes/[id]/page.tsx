import TopBar from "@/components/ui/TopBar";
import BottomTabs from "@/components/ui/BottomTabs";
import { db } from "@/lib/mongo";
import { requireUserId } from "@/lib/auth-helpers";
import { ObjectId } from "mongodb";
import { DEFAULT_PANTRY_BASICS } from "@/lib/pantry";

export const dynamic = "force-dynamic";

type Nutr = { kcal: number; protein: number; fat: number; carbs: number };

function sumNutr(ings: any[]): Nutr {
  const acc: Nutr = { kcal: 0, protein: 0, fat: 0, carbs: 0 };
  for (const i of ings || []) {
    if (!i?.per100) continue;
    const per = i.per100 as Partial<Nutr>;
    const amount = Number(i.amount ?? 0);
    const factor = i.unit === "g" || i.unit === "ml" ? amount / 100 : 1;
    acc.kcal += (Number(per.kcal ?? 0)) * factor;
    acc.protein += (Number(per.protein ?? 0)) * factor;
    acc.fat += (Number(per.fat ?? 0)) * factor;
    acc.carbs += (Number(per.carbs ?? 0)) * factor;
  }
  return {
    kcal: Math.round(acc.kcal),
    protein: Math.round(acc.protein),
    fat: Math.round(acc.fat),
    carbs: Math.round(acc.carbs),
  };
}

async function getData(id: string, userId: string) {
  const dbo = await db();

  const [recipe, inventory, settings] = await Promise.all([
    dbo.collection("recipes").findOne({ _id: new ObjectId(id), userId }),
    dbo.collection("inventory").find({ userId }).project({ name: 1 }).toArray(),
    dbo.collection("settings").findOne({ userId }),
  ]);

  if (!recipe) return { recipe: null as any, missingNames: [] as string[], nutr: { kcal: 0, protein: 0, fat: 0, carbs: 0 } };

  const invNames = inventory.map((i: any) => String(i.name || "").toLowerCase());
  const basicsEnabled = settings?.usePantryBasics !== false;
  const basicsList =
    basicsEnabled && Array.isArray(settings?.pantryBasics) && settings!.pantryBasics!.length
      ? (settings!.pantryBasics as string[])
      : (basicsEnabled ? DEFAULT_PANTRY_BASICS : []);
  const basics = basicsList.map((x) => x.toLowerCase());

  const have = new Set([...invNames, ...basics]);
  const ings = (recipe.ingredients || []).filter((i: any) => i?.name);
  const missing = ings.filter((i: any) => !have.has(String(i.name).toLowerCase()));

  const nutr = sumNutr(ings);

  return { recipe, missingNames: missing.map((m: any) => m.name), nutr };
}

export default async function RecipePage({ params }: { params: { id: string } }) {
  const userId = await requireUserId();
  const { recipe, missingNames, nutr } = await getData(params.id, userId);

  return (
    <>
      <TopBar />
      <main className="container-narrow section">
        {!recipe ? (
          <p className="text-muted">Рецепт не найден.</p>
        ) : (
          <>
            {/* Шапка с картинкой, кнопкой редактирования и КБЖУ */}
            <div className="card frost round-2xl mb-3">
              <div className="card-body">
                <div className="d-flex gap-3 align-items-center">
                  {recipe.image ? (
                    <img
                      src={recipe.image}
                      width={96}
                      height={96}
                      className="rounded-3 object-fit-cover"
                      alt=""
                    />
                  ) : (
                    <div className="rounded-3 bg-dark-subtle" style={{ width: 96, height: 96 }} />
                  )}

                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start">
                      <h1 className="h5 m-0">{recipe.title}</h1>
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge badge-soft">
                          <i className="bi bi-clock me-1" />
                          {recipe.timeMin} мин
                        </span>
                        <a
                          className="btn btn-sm btn-outline-light"
                          href={`/recipes/${params.id}/edit`}
                        >
                          <i className="bi bi-pencil" />
                        </a>
                      </div>
                    </div>

                    {/* КБЖУ */}
                    <div className="row g-2 mt-2">
                      <div className="col-6 col-md-3">
                        <span className="badge badge-soft w-100">Ккал: {nutr.kcal}</span>
                      </div>
                      <div className="col-6 col-md-3">
                        <span className="badge badge-soft w-100">Б: {nutr.protein} г</span>
                      </div>
                      <div className="col-6 col-md-3">
                        <span className="badge badge-soft w-100">Ж: {nutr.fat} г</span>
                      </div>
                      <div className="col-6 col-md-3">
                        <span className="badge badge-soft w-100">У: {nutr.carbs} г</span>
                      </div>
                    </div>

                    {/* Не хватает — чипсы */}
                    {missingNames.length ? (
                      <div className="mt-2 d-flex flex-wrap gap-1">
                        {missingNames.slice(0, 6).map((name: string, i: number) => (
                          <span
                            key={i}
                            className="badge bg-danger-subtle text-danger-emphasis text-truncate"
                            style={{ maxWidth: "100%" }}
                            title={name}
                          >
                            {name}
                          </span>
                        ))}
                        {missingNames.length > 6 && (
                          <span className="badge bg-secondary-subtle">
                            +{missingNames.length - 6} ещё
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="small text-muted mt-2">Все ингредиенты есть</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Секции: ингредиенты и шаги */}
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <div className="card frost round-2xl h-100">
                  <div className="card-body">
                    <h2 className="h6">Ингредиенты</h2>
                    <ul className="small m-0">
                      {(recipe.ingredients || []).map((x: any, i: number) => (
                        <li key={i}>
                          {x.name} — {x.amount} {x.unit}
                          {x?.per100 ? (
                            <span className="text-muted">
                              {" "}
                              (на 100: ккал {x.per100.kcal ?? 0} / Б {x.per100.protein ?? 0} / Ж{" "}
                              {x.per100.fat ?? 0} / У {x.per100.carbs ?? 0})
                            </span>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="card frost round-2xl h-100">
                  <div className="card-body">
                    <h2 className="h6">Шаги</h2>
                    <ol className="small m-0">
                      {(recipe.steps || []).map((s: string, i: number) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
      <BottomTabs />
    </>
  );
}
