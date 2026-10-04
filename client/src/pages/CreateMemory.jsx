import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Sparkles, X } from "lucide-react";
import api from "../services/api";

const types = [
  ["story", "Story", "A warm, detailed narrative"],
  ["poetry", "Poetry", "Emotional free-verse poem"],
  ["magazine", "Magazine", "A stylish memory spread"],
  ["short-book", "Short Book", "A mini book with chapters"]
];

export default function CreateMemory() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "", date: "", location: "", people: "", description: "", outputType: "story"
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, value));
      images.forEach(file => data.append("images", file));

      const response = await api.post("/memories", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      navigate(`/memory/${response.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not create memory");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <div className="form-container">
        <div className="page-heading">
          <div className="eyebrow"><Sparkles size={14}/> CREATE A MEMORY</div>
          <h1>Tell us what happened.</h1>
          <p>Don't worry about writing perfectly. Give the AI your real details and let it shape the memory.</p>
        </div>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={submit} className="memory-form">
          <div className="form-section">
            <h3>1. The moment</h3>
            <div className="two-col">
              <label>Memory title<input required value={form.title} onChange={e => setForm({...form,title:e.target.value})} placeholder="Our last college trip" /></label>
              <label>Date<input type="date" value={form.date} onChange={e => setForm({...form,date:e.target.value})} /></label>
            </div>
            <div className="two-col">
              <label>Location<input value={form.location} onChange={e => setForm({...form,location:e.target.value})} placeholder="Lucknow, Uttar Pradesh" /></label>
              <label>People<input value={form.people} onChange={e => setForm({...form,people:e.target.value})} placeholder="Akansha, Madhavi, Sahil..." /></label>
            </div>
            <label>What happened?<textarea required rows="8" value={form.description} onChange={e => setForm({...form,description:e.target.value})} placeholder="Write everything you remember — what happened, who was there, funny moments, emotions, small details…"/></label>
          </div>

          <div className="form-section">
            <h3>2. Add photos</h3>
            <label className="upload-box">
              <Upload size={25}/>
              <strong>Choose photos</strong>
              <span>JPG, PNG or WEBP · up to 8 photos</span>
              <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={e => setImages(Array.from(e.target.files || []))}/>
            </label>
            {images.length > 0 && <div className="file-list">{images.map((x,i)=><div key={i}>{x.name}<button type="button" onClick={()=>setImages(images.filter((_,n)=>n!==i))}><X size={14}/></button></div>)}</div>}
          </div>

          <div className="form-section">
            <h3>3. What should we create?</h3>
            <div className="output-options">
              {types.map(([value, title, desc]) => (
                <label key={value} className={`output-option ${form.outputType === value ? "selected" : ""}`}>
                  <input type="radio" name="outputType" value={value} checked={form.outputType === value} onChange={e=>setForm({...form,outputType:e.target.value})}/>
                  <strong>{title}</strong><span>{desc}</span>
                </label>
              ))}
            </div>
          </div>

          <button disabled={loading} className="primary-btn large full">{loading ? "Creating…" : "Create Memory Page ✦"}</button>
        </form>
      </div>
    </div>
  );
}
