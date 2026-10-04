import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Sparkles, Trash2, LoaderCircle } from "lucide-react";
import api from "../services/api";

export default function MemoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [memory, setMemory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const load = () => api.get(`/memories/${id}`).then(r => setMemory(r.data)).catch(e => setError(e.response?.data?.message || "Not found")).finally(()=>setLoading(false));

  useEffect(() => { load(); }, [id]);

  const generate = async () => {
    setGenerating(true); setError("");
    try {
      const { data } = await api.post(`/memories/${id}/generate`);
      setMemory(data);
    } catch (e) {
      setError(e.response?.data?.message || "Generation failed");
    } finally { setGenerating(false); }
  };

  const remove = async () => {
    if (!confirm("Delete this memory?")) return;
    await api.delete(`/memories/${id}`);
    navigate("/dashboard");
  };

  if (loading) return <div className="app-shell"><div className="empty">Loading…</div></div>;
  if (!memory) return <div className="app-shell"><div className="empty">{error || "Memory not found"}</div></div>;

  return (
    <div className="app-shell">
      <div className="detail-container">
        <Link to="/dashboard" className="back-link"><ArrowLeft size={16}/> Back to memories</Link>

        <section className="memory-detail-hero">
          <div className="detail-info">
            <div className="eyebrow"><Sparkles size={14}/> {memory.outputType.replace("-", " ").toUpperCase()}</div>
            <h1>{memory.title}</h1>
            <p>{memory.description}</p>
            <div className="detail-meta">
              {memory.date && <span>{new Date(memory.date).toLocaleDateString()}</span>}
              {memory.location && <span>• {memory.location}</span>}
            </div>
          </div>
          <div className="detail-actions">
            <button className="danger-btn" onClick={remove}><Trash2 size={16}/> Delete</button>
          </div>
        </section>

        {memory.images?.length > 0 && (
          <div className="image-gallery">
            {memory.images.map((img, i) => <img key={i} src={`${import.meta.env.VITE_SERVER_URL || "http://localhost:5000"}${img.url}`} alt={img.originalName} />)}
          </div>
        )}

        <section className="generation-card">
          <div className="generation-header">
            <div><span className="eyebrow">AI CREATION</span><h2>{memory.generatedContent ? "Your memory, transformed." : "Ready to transform it?"}</h2></div>
            {!memory.generatedContent && <button className="primary-btn" disabled={generating} onClick={generate}>{generating ? <><LoaderCircle className="spin" size={17}/> Creating…</> : <><Sparkles size={17}/> Generate with AI</>}</button>}
          </div>

          {error && <div className="error-box">{error}</div>}

          {memory.generatedContent ? (
            <article className="generated-content">{memory.generatedContent.split("\n").map((line,i)=>
              line.startsWith("# ") ? <h2 key={i}>{line.slice(2)}</h2> :
              line.startsWith("## ") ? <h3 key={i}>{line.slice(3)}</h3> :
              line.startsWith("- ") ? <li key={i}>{line.slice(2)}</li> :
              line ? <p key={i}>{line}</p> : <br key={i}/>
            )}</article>
          ) : (
            <div className="generation-empty"><Sparkles size={28}/><p>Generate a creative version of this memory using the format you selected.</p></div>
          )}
        </section>
      </div>
    </div>
  );
}
