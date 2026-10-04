import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BookHeart } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Auth({ mode }) {
  const isLogin = mode === "login";
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isLogin) await login(form.email, form.password);
      else await register(form.name, form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Link to="/" className="brand auth-brand"><span className="brand-mark"><BookHeart size={20} /></span>Memory<span>Book</span></Link>
      <div className="auth-card">
        <div className="eyebrow">✦ YOUR MEMORIES, YOUR BOOK</div>
        <h1>{isLogin ? "Welcome back." : "Create your memory space."}</h1>
        <p>{isLogin ? "Continue building your collection of meaningful moments." : "Start turning your life moments into creative keepsakes."}</p>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={submit}>
          {!isLogin && (
            <label>Name<input required value={form.name} onChange={e => setForm({...form, name:e.target.value})} placeholder="Your name" /></label>
          )}
          <label>Email<input required type="email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} placeholder="you@example.com" /></label>
          <label>Password<input required minLength="6" type="password" value={form.password} onChange={e => setForm({...form, password:e.target.value})} placeholder="At least 6 characters" /></label>
          <button disabled={loading} className="primary-btn full">{loading ? "Please wait…" : isLogin ? "Login" : "Create account"}</button>
        </form>

        <div className="auth-switch">
          {isLogin ? <>New here? <Link to="/register">Create account</Link></> : <>Already registered? <Link to="/login">Login</Link></>}
        </div>
      </div>
    </div>
  );
}
