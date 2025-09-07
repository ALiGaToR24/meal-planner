import Link from "next/link";

export default function RecipeCard({ id, title, time, tags }:{id:string; title:string; time:number; tags?:string[];}){
  return (
    <Link href={`/recipes/${id}`} className="text-reset text-decoration-none">
      <div className="card frost round-2xl h-100">
        <div className="card-body">
          <div className="fw-semibold mb-1">{title}</div>
          <div className="small text-muted mb-2"><i className="bi bi-clock me-1" />{time} мин</div>
          <div className="d-flex flex-wrap gap-1">
            {(tags||[]).slice(0,3).map(t=> <span key={t} className="badge badge-soft">{t}</span>)}
          </div>
        </div>
      </div>
    </Link>
  );
}
