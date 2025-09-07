import Image from "next/image";

export default function MealCard({ type, title, kcal, img }: {type:string; title:string; kcal:number; img?:string;}){
  return (
    <div className="card frost round-2xl">
      {img && (
        <div className="ratio ratio-21x9">
          <Image src={img} alt={title} width={800} height={400} className="object-fit-cover round-2xl"/>
        </div>
      )}
      <div className="card-body d-flex align-items-center justify-content-between">
        <div>
          <div className="text-muted text-uppercase small">{type}</div>
          <div className="fw-semibold">{title}</div>
        </div>
        <span className="badge badge-soft">{Math.round(kcal)} ккал</span>
      </div>
    </div>
  );
}
