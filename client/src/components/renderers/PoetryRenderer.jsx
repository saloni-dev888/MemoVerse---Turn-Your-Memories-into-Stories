export default function PoetryRenderer({
  data,
  images = [],
}) {
  if (!data) {
    return (
      <div className="renderer-empty">
        No poetry content available.
      </div>
    );
  }

  return (
    <article className="poetry-renderer">
      {/* COVER */}
      <section className="poetry-cover">
        {images[0] && (
          <img
            src={images[0].url}
            alt=""
          />
        )}

        <div className="poetry-cover-content">
          <span>
            {data.poetryStyle || "POETRY"}
          </span>

          <h1>
            {data.title || "Untitled"}
          </h1>

          {data.subtitle && (
            <p>{data.subtitle}</p>
          )}
        </div>
      </section>

      {/* POEM */}
      <section className="poem-page">
        <div className="poem-meta">
          <span>
            {data.mood || "A memory in verse"}
          </span>
        </div>

        <div className="poem-content">
          {data.poem
            ?.split(/\n\s*\n/)
            .filter(Boolean)
            .map((stanza, index) => (
              <p key={index}>
                {stanza}
              </p>
            ))}
        </div>

        {data.featuredLine && (
          <blockquote className="featured-poem-line">
            “{data.featuredLine}”
          </blockquote>
        )}
      </section>

      {/* VISUAL MOMENT */}
      {images.length > 1 && (
        <section className="poetry-photo-strip">
          {images
            .slice(1, 5)
            .map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt=""
              />
            ))}
        </section>
      )}

      {data.closingNote && (
        <section className="poetry-closing">
          <p>{data.closingNote}</p>
        </section>
      )}
    </article>
  );
}