export default function StatCard({ title, value, hint }: {title:string; value:string; hint?:string;}){
  return (
    <div className="card frost round-2xl h-100">
      <div className="card-body">
        <div className="text-muted small">{title}</div>
        <div className="display-6 fw-bold">{value}</div>
        {hint && <div className="small text-muted mt-1">{hint}</div>}
      </div>
    </div>
  );
}
