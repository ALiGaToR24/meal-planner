import TopNav from "@/components/ui/TopNav";
import BottomTabs from "@/components/ui/BottomTabs";
import StatCard from "@/components/ui/StatCard";
import MealCard from "@/components/meal/MealCard";

export default async function Home() {
  // пример: можно получить сессию и имя
  // const session = await getServerSession(authOptions);
  const email = undefined; // подставь session?.user?.email

  return (
    <>
      <TopNav email={email} />
      <main className="container-narrow section">
        {/* Hero */}
        <div className="py-3">
          <h1 className="h4 mb-1">Привет!</h1>
          <div className="text-muted">Вот твой план на сегодня 👇</div>
        </div>

        {/* Статы */}
        <div className="row g-3 mb-3">
          <div className="col-6 col-md-3"><StatCard title="Калории" value="1 845" hint="из 2 200" /></div>
          <div className="col-6 col-md-3"><StatCard title="Белки" value="112 г" hint="цель: 140 г" /></div>
          <div className="col-6 col-md-3"><StatCard title="Жиры" value="62 г" /></div>
          <div className="col-6 col-md-3"><StatCard title="Углеводы" value="196 г" /></div>
        </div>

        {/* Ближайшие приёмы */}
        <div className="d-flex align-items-center justify-content-between mb-2">
          <h2 className="h6 m-0">Сегодня</h2>
          <a className="btn btn-sm btn-brand" href="/week"><i className="bi bi-calendar-week me-1" />План на неделю</a>
        </div>
        <div className="vstack gap-3">
          <MealCard type="Завтрак" title="Овсянка с ягодами" kcal={420} img="/images/breakfast.jpg" />
          <MealCard type="Обед" title="Курица + рис + салат" kcal={650} img="/images/lunch.jpg" />
          <MealCard type="Ужин" title="Лосось и овощи" kcal={520} img="/images/dinner.jpg" />
          <MealCard type="Перекус" title="Йогурт" kcal={180} />
        </div>
        <div className="my-4 d-grid">
          <a href="/shopping" className="btn btn-outline-light"><i className="bi bi-bag-check me-2" />Список покупок</a>
        </div>
      </main>
      <BottomTabs />
    </>
  );
}
