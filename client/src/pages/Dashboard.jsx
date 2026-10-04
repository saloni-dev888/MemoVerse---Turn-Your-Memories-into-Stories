import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Sparkles, Plus, Clock3 } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import MemoryCard from "../components/MemoryCard";

export default function Dashboard() {
  const { user } = useAuth();
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/memories").then(r => setMemories(r.data)).finally(() => setLoading(false));
  }, []);

  const generated = memories.filter(m => m.status === "generated").length;

  return (
    <div className="app-shell">
      <div className="page-container">
        <section className="dashboard-welcome">
          <div>
            <div className="eyebrow"><Sparkles size={14} /> YOUR MEMORY SPACE</div>
            <h1>Hello, {user.name.split(" ")[0]}.</h1>
            <p>Your moments deserve more than a camera roll.</p>
          </div>
          <Link to="/create" className="primary-btn"><Plus size={18}/> Create Memory</Link>
        </section>

        <section className="stats">
          <div className="stat"><BookOpen /><div><strong>{memories.length}</strong><span>Total memories</span></div></div>
          <div className="stat"><Sparkles /><div><strong>{generated}</strong><span>AI creations</span></div></div>
          <div className="stat"><Clock3 /><div><strong>{memories.length - generated}</strong><span>Drafts</span></div></div>
        </section>

        <div className="section-heading"><div><h2>Your memories</h2><p>Your personal collection.</p></div></div>

        {loading ? <div className="empty">Loading memories…</div> :
          memories.length === 0 ? (
            <div className="empty empty-large">
              <div className="empty-icon">✦</div>
              <h3>Your first page is waiting.</h3>
              <p>Tell MemoryBook about a moment that matters to you.</p>
              <Link to="/create" className="primary-btn">Create memory</Link>
            </div>
          ) : (
            <div className="memory-grid">{memories.map(m => <MemoryCard key={m._id} memory={m} />)}</div>
          )}
      </div>
    </div>
  );
}
