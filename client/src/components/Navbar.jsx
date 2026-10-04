import { Link, useNavigate } from "react-router-dom";
import { BookOpen, LogOut, Plus } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <Link to="/dashboard" className="brand">
        <span className="brand-mark"><BookOpen size={20} /></span>
        <span>Memory<span>Book</span></span>
      </Link>

      {user && (
        <div className="nav-actions">
          <button className="ghost-btn" onClick={() => navigate("/create")}>
            <Plus size={17} /> Create Memory
          </button>
          <div className="user-chip">
            <span className="avatar">{user.name?.[0]?.toUpperCase()}</span>
            <span>{user.name}</span>
          </div>
          <button className="icon-btn" title="Logout" onClick={logout}>
            <LogOut size={18} />
          </button>
        </div>
      )}
    </header>
  );
}
