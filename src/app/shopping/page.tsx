import TopNav from "@/components/ui/TopNav";
import BottomTabs from "@/components/ui/BottomTabs";

const items = [
  {name:"Овсяные хлопья", qty:"500 г"},
  {name:"Молоко", qty:"1 л"},
  {name:"Куриное филе", qty:"800 г"},
];

export default function Shopping(){
  return (
    <>
      <TopNav />
      <main className="container-narrow section">
        <div className="d-flex align-items-center justify-content-between my-2">
          <h1 className="h5 m-0">Список покупок</h1>
          <button className="btn btn-sm btn-outline-light"><i className="bi bi-download me-1"/>Экспорт</button>
        </div>
        <ul className="list-group round-2xl overflow-hidden">
          {items.map((it,i)=>(
            <li key={i} className="list-group-item d-flex justify-content-between align-items-center bg-transparent text-white">
              <div>
                <input className="form-check-input me-2 ring" type="checkbox" />
                {it.name}
              </div>
              <span className="badge bg-secondary-subtle text-white">{it.qty}</span>
            </li>
          ))}
        </ul>
      </main>
      <BottomTabs/>
    </>
  );
}
