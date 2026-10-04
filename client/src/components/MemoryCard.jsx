import { Link } from "react-router-dom";
import { CalendarDays, MapPin, ArrowRight } from "lucide-react";

export default function MemoryCard({ memory }) {
  const image = memory.images?.[0]?.url
    ? `${import.meta.env.VITE_SERVER_URL || "http://localhost:5000"}${memory.images[0].url}`
    : null;

  return (
    <article className="memory-card">
      <div className="memory-cover">
        {image ? <img src={image} alt="" /> : <div className="cover-placeholder">✦</div>}
        <span className="type-badge">{memory.outputType.replace("-", " ")}</span>
      </div>
      <div className="memory-card-body">
        <h3>{memory.title}</h3>
        <p>{memory.description.slice(0, 110)}{memory.description.length > 110 ? "…" : ""}</p>
        <div className="memory-meta">
          {memory.date && <span><CalendarDays size={14} /> {new Date(memory.date).toLocaleDateString()}</span>}
          {memory.location && <span><MapPin size={14} /> {memory.location}</span>}
        </div>
        <Link to={`/memory/${memory._id}`} className="text-link">
          Open memory <ArrowRight size={15} />
        </Link>
      </div>
    </article>
  );
}
