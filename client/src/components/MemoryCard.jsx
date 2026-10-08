import { Link } from "react-router-dom";
import {
  CalendarDays,
  MapPin,
  ArrowRight,
  Trash2,
  Eye,
} from "lucide-react";

export default function MemoryCard({ memory, onDelete }) {
  const image = memory.images?.[0]?.url
    ? `${
        import.meta.env.VITE_SERVER_URL ||
        "http://localhost:5000"
      }${memory.images[0].url}`
    : null;

  const handleDelete = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (onDelete) {
      onDelete(memory._id);
    }
  };

  return (
    <article className="memory-card">

      {/* COVER */}
      <div className="memory-cover">

        {image ? (
          <img
            src={image}
            alt={memory.title || "Memory"}
          />
        ) : (
          <div className="cover-placeholder">
            ✦
          </div>
        )}

        <span className="type-badge">
          {memory.outputType?.replace("-", " ") || "Memory"}
        </span>

        {/* DELETE */}
        <button
          type="button"
          className="memory-delete-btn"
          onClick={handleDelete}
          title="Delete memory"
          aria-label="Delete memory"
        >
          <Trash2 size={16} />
        </button>

      </div>

      {/* CONTENT */}
      <div className="memory-card-body">

        <h3>
          {memory.title}
        </h3>

        <p>
          {memory.description?.slice(0, 110)}
          {memory.description?.length > 110 ? "…" : ""}
        </p>

        {/* META */}
        <div className="memory-meta">

          {memory.date && (
            <span>
              <CalendarDays size={14} />
              {new Date(memory.date).toLocaleDateString()}
            </span>
          )}

          {memory.location && (
            <span>
              <MapPin size={14} />
              {memory.location}
            </span>
          )}

        </div>

        {/* ACTIONS */}
        <div className="memory-card-actions">

          <Link
            to={`/memory/${memory._id}`}
            className="text-link"
          >
            <Eye size={15} />
            Open memory
            <ArrowRight size={15} />
          </Link>

          <button
            type="button"
            className="card-delete-link"
            onClick={handleDelete}
          >
            <Trash2 size={14} />
            Delete
          </button>

        </div>

      </div>

    </article>
  );
}