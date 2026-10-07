import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const TYPES = [
  {
    value: "story",
    icon: "📖",
    title: "Story Book",
    description:
      "Turn your memories into a beautifully written story with chapters, emotions and visual moments.",
  },
  {
    value: "poetry",
    icon: "✨",
    title: "Poetry",
    description:
      "Transform feelings and memories into genuine poetry with imagery, rhythm and emotion.",
  },
  {
    value: "magazine",
    icon: "📰",
    title: "Magazine",
    description:
      "Create a personal magazine with cover, editorial, highlights, photo stories and timeline.",
  },
];

const MAX_IMAGES = 50;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function CreateMemory() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    date: "",
    location: "",
    people: "",
    description: "",
    outputType: "story",
  });

  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /*
    Add photos in multiple batches.
    New selection is appended instead of replacing old photos.
  */
  const handleImages = (e) => {
    const selected = Array.from(e.target.files || []);

    if (!selected.length) return;

    setError("");

    const validImages = [];
    const invalidImages = [];

    selected.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        invalidImages.push(`${file.name} is not an image.`);
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        invalidImages.push(
          `${file.name} is larger than 5 MB.`
        );
        return;
      }

      validImages.push(file);
    });

    setImages((previous) => {
      const remaining =
        MAX_IMAGES - previous.length;

      if (remaining <= 0) {
        return previous;
      }

      return [
        ...previous,
        ...validImages.slice(0, remaining),
      ];
    });

    if (invalidImages.length) {
      setError(
        invalidImages.slice(0, 3).join(" ")
      );
    }

    /*
      Reset input so selecting the same photo again
      can trigger onChange.
    */
    e.target.value = "";
  };

  const removeImage = (index) => {
    setImages((previous) =>
      previous.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.title.trim()) {
      setError("Please enter a memory title.");
      return;
    }

    if (!form.description.trim()) {
      setError(
        "Please describe your memory before generating it."
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const data = new FormData();

      data.append("title", form.title);
      data.append("date", form.date);
      data.append("location", form.location);
      data.append("people", form.people);
      data.append("description", form.description);
      data.append("outputType", form.outputType);

      images.forEach((image) => {
        data.append("images", image);
      });

      /*
        Create the memory first.
      */
      const response = await api.post(
        "/memories",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const memory = response.data;

      /*
        Then ask AI to generate the creative version.
      */
      await api.post(
        `/memories/${memory._id}/generate`
      );

      navigate(`/memories/${memory._id}`);
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          "Something went wrong while creating your memory."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="create-memory-page">
      <div className="create-memory-header">
        <div>
          <span className="eyebrow">
            CREATE A MEMORY
          </span>

          <h1>Give your memories a new life.</h1>

          <p>
            Tell us what happened. The AI will understand
            the emotions, people and moments before turning
            them into your chosen format.
          </p>
        </div>
      </div>

      {error && (
        <div className="form-error">
          {error}
        </div>
      )}

      <form
        className="memory-form"
        onSubmit={handleSubmit}
      >
        {/* FORMAT */}
        <section className="form-section">
          <div className="section-heading">
            <span>01</span>

            <div>
              <h2>Choose your format</h2>
              <p>
                How would you like your memory to be
                remembered?
              </p>
            </div>
          </div>

          <div className="memory-type-grid">
            {TYPES.map((type) => (
              <button
                type="button"
                key={type.value}
                className={`memory-type-card ${
                  form.outputType === type.value
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    outputType: type.value,
                  }))
                }
              >
                <span className="memory-type-icon">
                  {type.icon}
                </span>

                <strong>{type.title}</strong>

                <span>
                  {type.description}
                </span>

                {form.outputType ===
                  type.value && (
                  <span className="selected-badge">
                    Selected
                  </span>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* BASIC DETAILS */}
        <section className="form-section">
          <div className="section-heading">
            <span>02</span>

            <div>
              <h2>Tell us about it</h2>
              <p>
                Share as much detail as you remember.
              </p>
            </div>
          </div>

          <div className="form-grid">
            <label className="form-field full">
              <span>Memory title *</span>

              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. The Summer We Never Wanted to End"
                maxLength={200}
              />
            </label>

            <label className="form-field">
              <span>Date</span>

              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
              />
            </label>

            <label className="form-field">
              <span>Location</span>

              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. College campus"
              />
            </label>

            <label className="form-field full">
              <span>People</span>

              <input
                name="people"
                value={form.people}
                onChange={handleChange}
                placeholder="e.g. Anshu, Riya, Aman"
              />

              <small>
                Separate multiple names with commas.
              </small>
            </label>

            <label className="form-field full">
              <span>Your memory *</span>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Write naturally. Tell the AI what happened, who was there, how you felt, important moments, funny incidents, small details..."
                rows={12}
              />

              <small>
                Don't worry about writing perfectly.
                Just tell the memory naturally.
              </small>
            </label>
          </div>
        </section>

        {/* PHOTOS */}
        <section className="form-section">
          <div className="section-heading">
            <span>03</span>

            <div>
              <h2>Add your photographs</h2>

              <p>
                Add up to 50 photos. You can select them
                in multiple batches.
              </p>
            </div>
          </div>

          <label className="photo-upload-box">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleImages}
              disabled={images.length >= MAX_IMAGES}
            />

            <span className="upload-icon">
              ＋
            </span>

            <strong>
              {images.length >= MAX_IMAGES
                ? "50 photos added"
                : "Add photographs"}
            </strong>

            <span>
              JPG, PNG or WEBP · Maximum 5 MB each
            </span>

            <span>
              {images.length}/{MAX_IMAGES} selected
            </span>
          </label>

          {images.length > 0 && (
            <div className="photo-preview-grid">
              {images.map((image, index) => (
                <div
                  className="photo-preview"
                  key={`${image.name}-${index}`}
                >
                  <img
                    src={URL.createObjectURL(image)}
                    alt={image.name}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeImage(index)
                    }
                    aria-label={`Remove ${image.name}`}
                  >
                    ×
                  </button>

                  <span>
                    {index + 1}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* SUBMIT */}
        <section className="create-action">
          <div>
            <strong>
              Ready to turn this memory into something
              special?
            </strong>

            <span>
              AI will understand your memory first and
              then create the selected format.
            </span>
          </div>

          <button
            type="submit"
            className="primary-button"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Creating your memory..."
              : "Create Memory ✨"}
          </button>
        </section>
      </form>
    </main>
  );
}