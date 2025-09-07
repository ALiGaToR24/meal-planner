"use client";
import Link from "next/link";

type Props = {
  id: string;
  title: string;
  image?: string;
  time?: number;
  tags?: string[];
  missing?: string[];
  showEdit?: boolean; // опционально показать кнопку редактирования
};

export default function RecipeCard({
  id, title, image, time = 15, tags = [], missing, showEdit = false,
}: Props) {
  const shown = (missing ?? []).slice(0, 3);
  const rest = Math.max(0, (missing?.length ?? 0) - shown.length);

  return (
    <div className="card frost round-2xl w-100 h-100">
      <div className="card-body d-flex gap-3 align-items-start">
        {/* превью */}
        {image
          ? <img src={image} alt="" width={72} height={72} className="rounded-3 object-fit-cover flex-shrink-0" />
          : <div className="rounded-3 bg-dark-subtle flex-shrink-0" style={{width:72,height:72}} />
        }

        {/* контент */}
        <div className="flex-grow-1 d-flex flex-column">
          <div className="d-flex justify-content-between align-items-start">
            <Link href={`/recipes/${id}`} className="stretched-link text-reset text-decoration-none">
              <div className="fw-semibold">{title}</div>
            </Link>
            <div className="d-flex align-items-center gap-2">
              <span className="badge badge-soft"><i className="bi bi-clock me-1" />{time} мин</span>
              {showEdit && (
                <Link href={`/recipes/${id}/edit`} className="btn btn-sm btn-outline-light">
                  <i className="bi bi-pencil" />
                </Link>
              )}
            </div>
          </div>

          {tags?.length ? (
            <div className="small text-muted mt-1">
              {tags.slice(0, 3).join(" · ")}{tags.length > 3 ? "…" : ""}
            </div>
          ) : null}

          {!!shown.length && (
            <div className="mt-auto d-flex flex-wrap gap-1 pt-1">
              {shown.map((name, i) => (
                <span key={i}
                      className="badge bg-danger-subtle text-danger-emphasis text-truncate"
                      style={{ maxWidth: "100%" }}
                      title={name}>
                  {name}
                </span>
              ))}
              {rest > 0 && <span className="badge bg-secondary-subtle">+{rest} ещё</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
