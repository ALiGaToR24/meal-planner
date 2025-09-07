import TopNav from "@/components/ui/TopNav";
import BottomTabs from "@/components/ui/BottomTabs";

export default function Settings(){
  return (
    <>
      <TopNav />
      <main className="container-narrow section">
        <h1 className="h5 my-2">Настройки</h1>

        <div className="card frost round-2xl mb-3">
          <div className="card-body">
            <div className="mb-2 fw-semibold">Цели</div>
            <div className="row g-2">
              <div className="col-4"><input className="form-control" placeholder="Ккал" defaultValue={2200}/></div>
              <div className="col-4"><input className="form-control" placeholder="Белки" defaultValue={140}/></div>
              <div className="col-4"><input className="form-control" placeholder="Жиры" defaultValue={70}/></div>
            </div>
          </div>
        </div>

        <div className="card frost round-2xl mb-3">
          <div className="card-body d-flex justify-content-between align-items-center">
            <div>
              <div className="fw-semibold">Тема</div>
              <div className="small text-muted">Светлая/тёмная</div>
            </div>
            <div className="btn-group" role="group">
              <button className="btn btn-outline-light btn-sm" onClick={()=>document.documentElement.setAttribute("data-bs-theme","light")}>Светлая</button>
              <button className="btn btn-brand btn-sm" onClick={()=>document.documentElement.setAttribute("data-bs-theme","dark")}>Тёмная</button>
            </div>
          </div>
        </div>

        <form action="/api/auth/signout" method="post" className="d-grid">
          <button className="btn btn-outline-danger"><i className="bi bi-box-arrow-right me-2"/>Выйти</button>
        </form>
      </main>
      <BottomTabs/>
    </>
  );
}
