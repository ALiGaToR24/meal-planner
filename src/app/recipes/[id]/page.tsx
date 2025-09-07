import TopNav from "@/components/ui/TopBar";
import BottomTabs from "@/components/ui/BottomTabs";

export default function RecipeView(){
  return (
    <>
      <TopNav />
      <main className="container-narrow section">
        <div className="card frost round-2xl mb-3">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between">
              <h1 className="h5 m-0">Овсянка с ягодами</h1>
              <span className="badge badge-soft"><i className="bi bi-clock me-1" />12 мин</span>
            </div>
            <div className="text-muted small mt-1">420 ккал • Б/Ж/У: 18/10/65</div>
          </div>
        </div>

        <div className="row g-3">
          <div className="col-12 col-md-6">
            <div className="card frost round-2xl h-100">
              <div className="card-body">
                <h2 className="h6">Ингредиенты</h2>
                <ul className="list-unstyled small m-0">
                  <li>Овсяные хлопья — 60 г</li>
                  <li>Молоко — 200 мл</li>
                  <li>Ягоды — 80 г</li>
                  <li>Мёд — 10 г</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="card frost round-2xl h-100">
              <div className="card-body">
                <h2 className="h6">Шаги</h2>
                <ol className="small m-0">
                  <li>Смешать хлопья с молоком, прогреть.</li>
                  <li>Добавить ягоды и мёд, перемешать.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div className="d-grid my-3">
          <button className="btn btn-brand"><i className="bi bi-plus-lg me-2"></i>Добавить в план</button>
        </div>
      </main>
      <BottomTabs/>
    </>
  );
}
