import { Link } from "react-router-dom";
import { BookHeart, Sparkles, Image, Feather, ArrowRight } from "lucide-react";

export default function Landing() {
  return (
    <div className="landing">
      <nav className="navbar landing-nav">
        <Link to="/" className="brand">
          <span className="brand-mark"><BookHeart size={20} /></span>
          <span>Memory<span>Book</span></span>
        </Link>
        <div className="nav-actions">
          <Link to="/login" className="ghost-btn">Login</Link>
          <Link to="/register" className="primary-btn">Start Creating</Link>
        </div>
      </nav>

      <main className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={15} /> AI-powered personal storytelling</div>
          <h1>Turn your memories into <em>something unforgettable.</em></h1>
          <p>
            Write about a college trip, family function, friendship or any special day.
            MemoryBook transforms your words and photos into a story, poem, magazine or short memory book.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="primary-btn large">Create your first memory <ArrowRight size={18} /></Link>
            <Link to="/login" className="text-link">Already have an account?</Link>
          </div>
        </div>

        <div className="hero-card">
          <div className="paper-top">A MEMORY WORTH KEEPING</div>
          <div className="hero-photo">✦</div>
          <h3>Our Last College Trip</h3>
          <p>“Some days end, but the feeling they leave behind stays…”</p>
          <div className="hero-card-footer"><span>Story</span><span>AI ✦</span></div>
        </div>
      </main>

      <section className="feature-strip">
        <div><Image /><h3>Your photos</h3><p>Keep the visual moments with the memory.</p></div>
        <div><Sparkles /><h3>AI transformation</h3><p>One memory, multiple creative formats.</p></div>
        <div><Feather /><h3>Your choice</h3><p>Story, poetry, magazine or short book.</p></div>
      </section>
    </div>
  );
}
