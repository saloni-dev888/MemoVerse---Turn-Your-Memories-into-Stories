export default function StoryBookRenderer({
  data,
  images = [],
}) {
  if (!data) {
    return (
      <div className="renderer-empty">
        No Story Book content available.
      </div>
    );
  }

  const chapters = data.chapters || [];

  return (
    <article className="story-book-renderer">
      {/* COVER */}
      <section className="story-cover">
        {images[0] && (
          <img
            src={images[0].url}
            alt=""
            className="story-cover-image"
          />
        )}

        <div className="story-cover-overlay">
          <span className="story-cover-label">
            A MEMORY STORY
          </span>

          <h1>
            {data.title || "Untitled Memory"}
          </h1>

          {data.subtitle && (
            <p>{data.subtitle}</p>
          )}
        </div>
      </section>

      {/* OPENING */}
      {data.openingLine && (
        <section className="story-opening">
          <p>{data.openingLine}</p>
        </section>
      )}

      {/* CHAPTERS */}
      {chapters.map((chapter, index) => {
        const image =
          images[index % images.length];

        return (
          <section
            className="story-chapter"
            key={chapter.chapterNumber || index}
          >
            <div className="chapter-heading">
              <span>
                Chapter{" "}
                {String(
                  chapter.chapterNumber ||
                    index + 1
                ).padStart(2, "0")}
              </span>

              <h2>{chapter.title}</h2>

              {chapter.subtitle && (
                <p>{chapter.subtitle}</p>
              )}
            </div>

            {image && (
              <div
                className={`story-photo story-photo-${chapter.photoLayout || "cinematic"}`}
              >
                <img
                  src={image.url}
                  alt=""
                />

                {chapter.photoSuggestion && (
                  <small>
                    {chapter.photoSuggestion}
                  </small>
                )}
              </div>
            )}

            <div className="chapter-content">
              {chapter.openingLine && (
                <p className="chapter-opening">
                  {chapter.openingLine}
                </p>
              )}

              {chapter.content
                ?.split(/\n\s*\n/)
                .filter(Boolean)
                .map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}

              {chapter.quote && (
                <blockquote>
                  “{chapter.quote}”
                </blockquote>
              )}
            </div>
          </section>
        );
      })}

      {/* FINAL REFLECTION */}
      {data.finalReflection && (
        <section className="story-reflection">
          <span>LOOKING BACK</span>

          <p>{data.finalReflection}</p>
        </section>
      )}

      {data.closingQuote && (
        <section className="story-closing">
          <blockquote>
            “{data.closingQuote}”
          </blockquote>
        </section>
      )}
    </article>
  );
}