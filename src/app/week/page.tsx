import TopNav from "@/components/ui/TopBar";
import BottomTabs from "@/components/ui/BottomTabs";

export default function WeekPage(){
  return (
    <>
      <TopNav />
      <main className="container-narrow section">
        <div className="d-flex align-items-center justify-content-between my-2">
          <h1 className="h5 m-0">План на неделю</h1>
          <a className="btn btn-sm btn-brand" href="#"><i className="bi bi-plus-lg me-1" />Добавить блюдо</a>
        </div>
        <div className="vstack gap-3">
          {["Пн","Вт","Ср","Чт","Пт","Сб","Вс"].map((d,i)=>(
            <div key={i} className="card frost round-2xl">
              <div className="card-body">
                <div className="fw-semibold mb-2">{d}</div>
                <div className="d-flex flex-wrap gap-2">
                  <span className="badge badge-soft">Завтрак: Овсянка</span>
                  <span className="badge badge-soft">Обед: Курица</span>
                  <span className="badge badge-soft">Ужин: Лосось</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <BottomTabs/>
    </>
  );
}
