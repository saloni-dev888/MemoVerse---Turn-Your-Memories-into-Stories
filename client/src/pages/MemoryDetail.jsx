import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Sparkles,
  Trash2,
  LoaderCircle,
  Image as ImageIcon,
} from "lucide-react";

import api from "../services/api";

import StoryBookRenderer from "../components/renderers/StoryBookRenderer";
import PoetryRenderer from "../components/renderers/PoetryRenderer";
import MagazineRenderer from "../components/renderers/MagazineRenderer";
import PhotoCollage from "../components/renderers/PhotoCollage";

const fallbackRender = (text) => (
  <>
    {text.split("\n").map((line, index) => {
      if (line.startsWith("# ")) {
        return (
          <h2 key={index}>
            {line.slice(2)}
          </h2>
        );
      }

      if (line.startsWith("## ")) {
        return (
          <h3 key={index}>
            {line.slice(3)}
          </h3>
        );
      }

      if (line.startsWith("- ")) {
        return (
          <li key={index}>
            {line.slice(2)}
          </li>
        );
      }

      if (line) {
        return (
          <p key={index}>
            {line}
          </p>
        );
      }

      return <br key={index} />;
    })}
  </>
);

export default function MemoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [memory, setMemory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  /* LOAD MEMORY */
  useEffect(() => {
    const loadMemory = async () => {
      try {
        const response = await api.get(`/memories/${id}`);
        setMemory(response.data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Memory not found"
        );
      } finally {
        setLoading(false);
      }
    };

    loadMemory();
  }, [id]);

  /* GENERATE */
  const generate = async () => {
    setGenerating(true);
    setError("");

    try {
      const response = await api.post(
        `/memories/${id}/generate`
      );

      setMemory(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Generation failed"
      );
    } finally {
      setGenerating(false);
    }
  };

  /* DELETE */
  const remove = async () => {
    const confirmed = window.confirm(
      `Delete "${memory.title}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    setDeleting(true);
    setError("");

    try {
      await api.delete(`/memories/${id}`);

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error("Delete failed:", error);

      setError(
        error.response?.data?.message ||
          "Unable to delete this memory."
      );

      setDeleting(false);
    }
  };

  /* LOADING */
  if (loading) {
    return (
      <div className="app-shell">
        <div className="empty">
          Loading memory…
        </div>
      </div>
    );
  }

  /* NOT FOUND */
  if (!memory) {
    return (
      <div className="app-shell">
        <div className="empty">

          <h3>
            {error || "Memory not found"}
          </h3>

          <Link
            to="/dashboard"
            className="primary-btn"
          >
            Back to Dashboard
          </Link>

        </div>
      </div>
    );
  }

  const content = memory.generatedContent || "";
  const generated = memory.generatedData;

  return (
    <div className="app-shell">

      <div className="detail-container">

        {/* BACK */}
        <Link
          to="/dashboard"
          className="back-link"
        >
          <ArrowLeft size={16} />
          Back to memories
        </Link>

        {/* HERO */}
        <section className="memory-detail-hero">

          <div className="detail-info">

            <div className="eyebrow">
              <Sparkles size={14} />

              {memory.outputType
                ?.replace("-", " ")
                .toUpperCase()}
            </div>

            <h1>
              {memory.generatedTitle ||
                memory.title}
            </h1>

            <p>
              {memory.description}
            </p>

            <div className="detail-meta">

              {memory.date && (
                <span>
                  {new Date(
                    memory.date
                  ).toLocaleDateString()}
                </span>
              )}

              {memory.location && (
                <span>
                  • {memory.location}
                </span>
              )}

              {memory.images?.length > 0 && (
                <span>
                  • {memory.images.length} photos
                </span>
              )}

            </div>

          </div>

          {/* DELETE */}
          <button
            className="danger-btn"
            onClick={remove}
            disabled={deleting}
          >
            {deleting ? (
              <>
                <LoaderCircle
                  className="spin"
                  size={16}
                />
                Deleting…
              </>
            ) : (
              <>
                <Trash2 size={16} />
                Delete Memory
              </>
            )}
          </button>

        </section>

        {/* ERROR */}
        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        {/* PHOTOS */}
        {memory.images?.length > 0 && (
          <>
            <div className="photo-section-heading">

              <div>
                <span className="eyebrow">
                  <ImageIcon size={14} />
                  VISUAL MEMORY
                </span>

                <h2>
                  Your moments,
                  intelligently arranged.
                </h2>
              </div>

            </div>

            <PhotoCollage
              images={memory.images}
            />
          </>
        )}

        {/* AI CREATION */}
        <section className="generation-card">

          <div className="generation-header">

            <div>
              <span className="eyebrow">
                AI CREATION
              </span>

              <h2>
                {content
                  ? "Your memory, transformed."
                  : "Ready to transform it?"}
              </h2>
            </div>

            {!content && (
              <button
                className="primary-btn"
                disabled={generating}
                onClick={generate}
              >
                {generating ? (
                  <>
                    <LoaderCircle
                      className="spin"
                      size={17}
                    />
                    Creating…
                  </>
                ) : (
                  <>
                    <Sparkles size={17} />
                    Generate with AI
                  </>
                )}
              </button>
            )}

          </div>

          {content ? (
            <div className="creative-output">

              {memory.outputType === "story" && (
                <StoryBookRenderer
                  data={generated}
                  fallback={fallbackRender(content)}
                />
              )}

              {memory.outputType === "poetry" && (
                <PoetryRenderer
                  data={generated}
                  fallback={fallbackRender(content)}
                />
              )}

              {memory.outputType === "magazine" && (
                <MagazineRenderer
                  data={generated}
                  fallback={fallbackRender(content)}
                />
              )}

            </div>
          ) : (
            <div className="generation-empty">

              <Sparkles size={28} />

              <p>
                Generate a creative version of this
                memory using the format you selected.
              </p>

            </div>
          )}

        </section>

      </div>
    </div>
  );
}