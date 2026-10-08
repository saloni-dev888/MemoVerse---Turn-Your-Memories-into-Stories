import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Sparkles,
  Plus,
  Clock3,
  ArrowRight,
  ImagePlus,
} from "lucide-react";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import MemoryCard from "../components/MemoryCard";

const styles = ["Anime", "Scrapbook", "Cinematic", "Dreamy"];

export default function Dashboard() {
  const { user } = useAuth();

  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/memories")
      .then((response) => {
        setMemories(response.data || []);
      })
      .catch((error) => {
        console.error("Failed to load memories:", error);
        setMemories([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const generated = memories.filter(
    (memory) => memory.status === "generated"
  ).length;

  const drafts = memories.length - generated;

  const firstImage = memories.find(
    (memory) => memory.images?.length
  )?.images?.[0]?.url;

  const base =
    import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div className="app-shell">
      <div className="page-container dashboard-page">

        {/* ================= HERO ================= */}
        <section className="dashboard-hero">
          <div>
            <div className="eyebrow">
              <Sparkles size={14} />
              YOUR PERSONAL MEMORY SPACE
            </div>

            <h1>
              Welcome back,
              <br />
              <em>{firstName}.</em>
            </h1>

            <p>
              Your memories deserve more than a folder. Turn moments,
              people and feelings into stories you can revisit anytime.
            </p>

            <div className="hero-pills">
              {styles.map((style) => (
                <span key={style}>{style}</span>
              ))}
            </div>
          </div>

          <Link to="/create" className="primary-btn hero-create">
            <Plus size={18} />
            Create New Memory
          </Link>
        </section>

        {/* ================= STATS ================= */}
        <section className="stats">

          <div className="stat">
            <BookOpen size={22} />

            <div>
              <strong>{memories.length}</strong>
              <span>Total memories</span>
              <small>YOUR COLLECTION</small>
            </div>
          </div>

          <div className="stat">
            <Sparkles size={22} />

            <div>
              <strong>{generated}</strong>
              <span>AI creations</span>
              <small>TRANSFORMED</small>
            </div>
          </div>

          <div className="stat">
            <Clock3 size={22} />

            <div>
              <strong>{drafts}</strong>
              <span>Drafts</span>
              <small>WAITING FOR YOU</small>
            </div>
          </div>

        </section>

        {/* ================= CREATION OPTIONS ================= */}
        <section className="creation-showcase">

          <div className="section-heading">
            <div>
              <span className="section-kicker">
                CREATE SOMETHING BEAUTIFUL
              </span>

              <h2>How do you want to remember it?</h2>

              <p>
                Choose a format and let MemoryBook shape your memories
                into something special.
              </p>
            </div>
          </div>

          <div className="creation-cards">

            {/* STORY */}
            <Link to="/create" className="creation-card story">
              <span>01</span>

              <BookOpen size={24} />

              <h3>Story Book</h3>

              <p>
                Turn your memories into a meaningful story with
                chapters, scenes and an emotional ending.
              </p>

              <ArrowRight size={18} />
            </Link>

            {/* POETRY */}
            <Link to="/create" className="creation-card poetry">
              <span>02</span>

              <Sparkles size={24} />

              <h3>Poetry</h3>

              <p>
                Transform the feelings behind your memories into
                original emotional poetry.
              </p>

              <ArrowRight size={18} />
            </Link>

            {/* MAGAZINE */}
            <Link to="/create" className="creation-card magazine">
              <span>03</span>

              <ImagePlus size={24} />

              <h3>Magazine</h3>

              <p>
                Create a visual magazine with highlights, people,
                moments and a beautiful timeline.
              </p>

              <ArrowRight size={18} />
            </Link>

          </div>
        </section>

        {/* ================= RECENT MEMORIES ================= */}
        <section className="recent-section">

          <div className="section-heading">

            <div>
              <span className="section-kicker">
                YOUR PERSONAL COLLECTION
              </span>

              <h2>Recent memories</h2>

              <p>
                Every memory gets its own little world.
              </p>
            </div>

            {memories.length > 0 && (
              <Link to="/create" className="text-link">
                Add another
                <ArrowRight size={15} />
              </Link>
            )}

          </div>

          {loading ? (
            <div className="empty">
              Loading memories…
            </div>
          ) : memories.length === 0 ? (

            <div className="empty empty-large">

              <div className="empty-icon">✦</div>

              <h3>Your first page is waiting.</h3>

              <p>
                Tell MemoryBook about a moment that matters to you.
              </p>

              <Link to="/create" className="primary-btn">
                Create memory
              </Link>

            </div>

          ) : (

            <div className="memory-grid">
              {memories.map((memory) => (
                <MemoryCard
                  key={memory._id}
                  memory={memory}
                />
              ))}
            </div>

          )}

        </section>

        {/* ================= PHOTO SHOWCASE ================= */}
        {firstImage && (
          <section className="visual-showcase">

            <img
              src={`${base}${firstImage}`}
              alt="Memory preview"
            />

            <div>

              <span className="eyebrow">
                A PLACE FOR THE DETAILS
              </span>

              <h2>
                Your photos are part of the story.
              </h2>

              <p>
                MemoryBook can arrange your photos as a hero image,
                split spread, collage or visual sequence instead of
                keeping them as a simple gallery.
              </p>

              <Link to="/create" className="text-link">
                Create a new memory
                <ArrowRight size={15} />
              </Link>

            </div>

          </section>
        )}

      </div>
    </div>
  );
}