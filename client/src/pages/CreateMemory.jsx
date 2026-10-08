import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  Sparkles,
  X,
  ImagePlus,
  BookOpen,
  PenLine,
  Newspaper,
  CheckCircle2,
  MapPin,
  Users,
  CalendarDays,
  ArrowRight,
  WandSparkles,
  Heart,
} from "lucide-react";

import api from "../services/api";

const types = [
  {
    value: "story",
    title: "Story Book",
    short: "A beautiful story",
    desc: "Turn your memory into a cinematic story with scenes, emotions and chapters.",
    icon: BookOpen,
    number: "01",
  },
  {
    value: "poetry",
    title: "Poetry",
    short: "Feel it in words",
    desc: "Transform the emotion behind your memory into genuine original poetry.",
    icon: PenLine,
    number: "02",
  },
  {
    value: "magazine",
    title: "Magazine",
    short: "Your memory issue",
    desc: "Create an editorial-style magazine with highlights, photos and timeline.",
    icon: Newspaper,
    number: "03",
  },
];

const MAX_IMAGES = 50;

export default function CreateMemory() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    date: "",
    location: "",
    people: "",
    description: "",
    outputType: "story",
    language: "English",
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  const previews = useMemo(
    () =>
      images.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      })),
    [images]
  );

  const selectedFormat =
    types.find((item) => item.value === form.outputType) || types[0];

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addFiles = (fileList) => {
    const selected = Array.from(fileList || []).filter((file) =>
      ["image/jpeg", "image/png", "image/webp"].includes(file.type)
    );

    if (!selected.length) return;

    const available = MAX_IMAGES - images.length;

    if (available <= 0) {
      setError(`You can add up to ${MAX_IMAGES} photos.`);
      return;
    }

    const accepted = selected
      .filter((file) => file.size <= 5 * 1024 * 1024)
      .slice(0, available);

    setImages((prev) => [...prev, ...accepted]);
    setError("");
  };

  const handleFileChange = (e) => {
    addFiles(e.target.files);
    e.target.value = "";
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const submit = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.title.trim()) {
      setError("Please give your memory a title.");
      return;
    }

    if (!form.description.trim()) {
      setError("Please tell us what happened in your own words.");
      return;
    }

    if (images.length > MAX_IMAGES) {
      setError(`You can add up to ${MAX_IMAGES} photos.`);
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        data.append(key, value);
      });

      images.forEach((file) => {
        data.append("images", file);
      });

      const response = await api.post("/memories", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate(`/memory/${response.data._id}`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not create memory. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <div className="create-modern-page">
        {/* ================= HEADER ================= */}

        <header className="create-modern-header">
          <div className="create-modern-kicker">
            <span className="kicker-icon">
              <Sparkles size={14} />
            </span>
            MEMORY CREATOR
          </div>

          <h1>
            Give your memories
            <br />
            <em>a life of their own.</em>
          </h1>

          <p>
            Tell us what happened naturally. We'll understand the people,
            emotions and little details before turning them into something
            worth revisiting.
          </p>

          {/* Progress */}

          <div className="create-progress">
            <div className="progress-step active">
              <span>01</span>
              <div>
                <strong>Your memory</strong>
                <small>Tell us what happened</small>
              </div>
            </div>

            <div className="progress-line" />

            <div className="progress-step">
              <span>02</span>
              <div>
                <strong>Your photos</strong>
                <small>Add the moments</small>
              </div>
            </div>

            <div className="progress-line" />

            <div className="progress-step">
              <span>03</span>
              <div>
                <strong>Your format</strong>
                <small>Choose the feeling</small>
              </div>
            </div>
          </div>
        </header>

        {error && (
          <div className="create-error">
            <span>!</span>
            {error}
          </div>
        )}

        <form onSubmit={submit}>
          <div className="create-modern-layout">
            {/* ================= MAIN FORM ================= */}

            <main className="create-main">
              {/* MEMORY */}

              <section className="create-modern-section">
                <div className="modern-section-heading">
                  <div className="section-number">01</div>

                  <div>
                    <span>THE MEMORY</span>
                    <h2>Start with what really happened.</h2>
                    <p>
                      Don't worry about writing perfectly. Just tell it like
                      you're telling a friend.
                    </p>
                  </div>
                </div>

                <div className="modern-form-card">
                  <div className="modern-two-col">
                    <label className="modern-field">
                      <span>
                        Memory title <b>*</b>
                      </span>

                      <input
                        required
                        value={form.title}
                        onChange={(e) =>
                          updateField("title", e.target.value)
                        }
                        placeholder="The summer we never wanted to end"
                      />
                    </label>

                    <label className="modern-field">
                      <span>Date</span>

                      <div className="input-with-icon">
                        <CalendarDays size={17} />

                        <input
                          type="date"
                          value={form.date}
                          onChange={(e) =>
                            updateField("date", e.target.value)
                          }
                        />
                      </div>
                    </label>
                  </div>

                  <div className="modern-two-col">
                    <label className="modern-field">
                      <span>Location</span>

                      <div className="input-with-icon">
                        <MapPin size={17} />

                        <input
                          value={form.location}
                          onChange={(e) =>
                            updateField("location", e.target.value)
                          }
                          placeholder="Lucknow, Uttar Pradesh"
                        />
                      </div>
                    </label>

                    <label className="modern-field">
                      <span>People</span>

                      <div className="input-with-icon">
                        <Users size={17} />

                        <input
                          value={form.people}
                          onChange={(e) =>
                            updateField("people", e.target.value)
                          }
                          placeholder="Friends, family, classmates..."
                        />
                      </div>
                    </label>
                  </div>

                  <label className="modern-field">
                    <div className="textarea-heading">
                      <span>
                        Tell the memory in your own words <b>*</b>
                      </span>

                      <small>{form.description.length} characters</small>
                    </div>

                    <textarea
                      required
                      rows="10"
                      value={form.description}
                      onChange={(e) =>
                        updateField("description", e.target.value)
                      }
                      placeholder="What happened? Who was there? What made you laugh? Was there a small moment you'll never forget? What were you feeling? Tell us everything you remember..."
                    />
                  </label>

                  <div className="ai-writing-tip">
                    <div>
                      <WandSparkles size={17} />
                    </div>

                    <p>
                      <strong>You don't need to write beautifully.</strong>
                      <br />
                      The more honest little details you share, the more
                      personal your final creation will feel.
                    </p>
                  </div>
                </div>
              </section>

              {/* PHOTOS */}

              <section className="create-modern-section">
                <div className="modern-section-heading">
                  <div className="section-number">02</div>

                  <div>
                    <span>THE VISUAL MEMORY</span>
                    <h2>Bring the moments to life.</h2>
                    <p>Add photographs that belong to this memory.</p>
                  </div>

                  <strong className="modern-photo-count">
                    {images.length}/{MAX_IMAGES}
                  </strong>
                </div>

                <label
                  className={`modern-upload ${
                    dragging ? "dragging" : ""
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={handleFileChange}
                  />

                  <div className="upload-orbit">
                    <ImagePlus size={27} />
                  </div>

                  <strong>
                    {dragging
                      ? "Drop your memories here"
                      : "Drop your photographs here"}
                  </strong>

                  <span>
                    or <u>browse from your computer</u>
                  </span>

                  <small>
                    JPG, PNG or WEBP · Maximum 5 MB each · Up to 50 photos
                  </small>
                </label>

                {previews.length > 0 && (
                  <div className="modern-photo-grid">
                    {previews.map(({ file, url }, index) => (
                      <div
                        className="modern-photo"
                        key={`${file.name}-${index}`}
                      >
                        <img src={url} alt={file.name} />

                        <span className="photo-number">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          aria-label={`Remove ${file.name}`}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}

                    {images.length < MAX_IMAGES && (
                      <label className="add-more-photo">
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          multiple
                          onChange={handleFileChange}
                        />

                        <PlusIcon />

                        <span>Add more</span>
                      </label>
                    )}
                  </div>
                )}
              </section>

              {/* FORMAT */}

              <section className="create-modern-section">
                <div className="modern-section-heading">
                  <div className="section-number">03</div>

                  <div>
                    <span>CREATIVE FORMAT</span>
                    <h2>How should your memory feel?</h2>
                    <p>
                      Choose the form that best matches the memory.
                    </p>
                  </div>
                </div>

                <div className="modern-format-grid">
                  {types.map((type) => {
                    const Icon = type.icon;

                    const selected =
                      form.outputType === type.value;

                    return (
                      <label
                        key={type.value}
                        className={`modern-format-card ${
                          selected ? "selected" : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name="outputType"
                          value={type.value}
                          checked={selected}
                          onChange={(e) =>
                            updateField(
                              "outputType",
                              e.target.value
                            )
                          }
                        />

                        <div className="format-top">
                          <span className="format-number">
                            {type.number}
                          </span>

                          <span className="format-check">
                            {selected ? (
                              <CheckCircle2 size={19} />
                            ) : (
                              <Icon size={19} />
                            )}
                          </span>
                        </div>

                        <Icon
                          className="format-main-icon"
                          size={28}
                        />

                        <h3>{type.title}</h3>

                        <strong>{type.short}</strong>

                        <p>{type.desc}</p>

                        <div className="format-arrow">
                          <ArrowRight size={16} />
                        </div>
                      </label>
                    );
                  })}
                </div>

                {/* ================= LANGUAGE ================= */}

                <div className="language-selector">
                  <div className="language-selector-heading">
                    <span>LANGUAGE</span>

                    <h3>How should your memory be written?</h3>

                    <p>
                      Choose the language for your AI-generated creation.
                    </p>
                  </div>

                  <div className="language-options">
                    <label
                      className={`language-option ${
                        form.language === "English"
                          ? "selected"
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="language"
                        value="English"
                        checked={form.language === "English"}
                        onChange={(e) =>
                          updateField(
                            "language",
                            e.target.value
                          )
                        }
                      />

                      <span className="language-flag">
                        🇬🇧
                      </span>

                      <span>
                        <strong>English</strong>
                        <small>Creative English</small>
                      </span>
                    </label>

                    <label
                      className={`language-option ${
                        form.language === "Hindi"
                          ? "selected"
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="language"
                        value="Hindi"
                        checked={form.language === "Hindi"}
                        onChange={(e) =>
                          updateField(
                            "language",
                            e.target.value
                          )
                        }
                      />

                      <span className="language-flag">
                        🇮🇳
                      </span>

                      <span>
                        <strong>हिंदी</strong>
                        <small>रचनात्मक हिंदी</small>
                      </span>
                    </label>
                  </div>
                </div>
              </section>

              {/* CREATE */}

              <section className="create-final-card">
                <div className="final-spark">
                  <Sparkles size={22} />
                </div>

                <div className="final-content">
                  <span>READY WHEN YOU ARE</span>

                  <h2>
                    Turn this memory into
                    <em> something special.</em>
                  </h2>

                  <p>
                    Your photos, details and feelings will become a{" "}
                    <strong>{selectedFormat.title}</strong>.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="ai-create-button"
                >
                  {loading ? (
                    <>
                      <span className="ai-spinner" />
                      Creating your memory...
                    </>
                  ) : (
                    <>
                      <WandSparkles size={19} />
                      Create with AI
                      <span>✦</span>
                    </>
                  )}
                </button>
              </section>
            </main>

            {/* ================= LIVE PREVIEW ================= */}

            <aside className="memory-live-preview">
              <div className="live-preview-label">
                <span className="live-dot" />
                LIVE PREVIEW
              </div>

              <div className="preview-paper">
                <div className="preview-paper-top">
                  <span>MEMORYBOOK</span>
                  <Sparkles size={13} />
                </div>

                <div className="preview-cover">
                  {previews.length > 0 ? (
                    <img
                      src={previews[0].url}
                      alt="Memory preview"
                    />
                  ) : (
                    <div className="preview-placeholder">
                      <Heart size={24} />
                      <span>Your memory</span>
                    </div>
                  )}

                  <div className="preview-overlay">
                    <small>
                      {selectedFormat.title.toUpperCase()}
                    </small>

                    <h3>
                      {form.title || "Your memory title"}
                    </h3>
                  </div>
                </div>

                <div className="preview-details">
                  {form.date && (
                    <div>
                      <CalendarDays size={13} />
                      {form.date}
                    </div>
                  )}

                  {form.location && (
                    <div>
                      <MapPin size={13} />
                      {form.location}
                    </div>
                  )}

                  {form.people && (
                    <div>
                      <Users size={13} />
                      {form.people}
                    </div>
                  )}
                </div>

                <div className="preview-description">
                  {form.description ? (
                    <>
                      <span>THE MEMORY</span>

                      <p>
                        {form.description.length > 170
                          ? `${form.description.slice(0, 170)}...`
                          : form.description}
                      </p>
                    </>
                  ) : (
                    <div className="preview-empty">
                      Start writing your memory and
                      <br />
                      you'll see a preview here.
                    </div>
                  )}
                </div>

                <div className="preview-footer">
                  <span>
                    {images.length}{" "}
                    {images.length === 1 ? "photo" : "photos"}
                  </span>

                  <span>✦</span>

                  <span>{selectedFormat.title}</span>
                </div>
              </div>

              <div className="preview-note">
                <Sparkles size={14} />
                Your final creation will be generated from
                everything you share here.
              </div>
            </aside>
          </div>
        </form>
      </div>
    </div>
  );
}

function PlusIcon() {
  return <span className="plus-icon">+</span>;
}