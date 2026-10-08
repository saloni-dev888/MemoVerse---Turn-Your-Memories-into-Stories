export default function MagazineRenderer({
  data,
  images = [],
}) {
  if (!data) {
    return (
      <div className="renderer-empty">
        No magazine content available.
      </div>
    );
  }

  return (
    <article className="magazine-renderer">
      {/* COVER */}
      <section className="magazine-cover">
        {images[0] && (
          <img
            src={images[0].url}
            alt=""
          />
        )}

        <div className="magazine-cover-content">
          <span className="magazine-name">
            MEMORY EDITION
          </span>

          <h1>
            {data.coverHeadline ||
              data.title ||
              "Memory"}
          </h1>

          {data.coverTagline && (
            <p>{data.coverTagline}</p>
          )}
        </div>
      </section>

      {/* EDITOR NOTE */}
      {data.editorNote && (
        <section className="magazine-editor-note">
          <span>FROM THE EDITOR</span>

          <h2>
            {data.editorNote.heading}
          </h2>

          <p>
            {data.editorNote.content}
          </p>
        </section>
      )}

      {/* HIGHLIGHTS */}
      {data.highlights?.length > 0 && (
        <section className="magazine-highlights">
          {data.highlights.map(
            (item, index) => (
              <div key={index}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            )
          )}
        </section>
      )}

      {/* MAIN STORY */}
      {data.mainStory && (
        <section className="magazine-main-story">
          <div className="magazine-section-title">
            <span>FEATURE</span>

            <h2>
              {data.mainStory.heading}
            </h2>

            {data.mainStory.subheading && (
              <p>
                {data.mainStory.subheading}
              </p>
            )}
          </div>

          <div className="magazine-story-body">
            {data.mainStory.content
              ?.split(/\n\s*\n/)
              .filter(Boolean)
              .map((paragraph, index) => (
                <p key={index}>
                  {paragraph}
                </p>
              ))}
          </div>
        </section>
      )}

      {/* PEOPLE */}
      {data.peopleSection?.people
        ?.length > 0 && (
        <section className="magazine-people">
          <div className="magazine-section-title">
            <span>THE PEOPLE</span>

            <h2>
              {data.peopleSection.heading}
            </h2>

            {data.peopleSection.intro && (
              <p>
                {data.peopleSection.intro}
              </p>
            )}
          </div>

          <div className="people-grid">
            {data.peopleSection.people.map(
              (person, index) => (
                <div
                  className="person-card"
                  key={index}
                >
                  <span>
                    {String(index + 1).padStart(
                      2,
                      "0"
                    )}
                  </span>

                  <h3>{person.name}</h3>

                  {person.role && (
                    <small>
                      {person.role}
                    </small>
                  )}

                  <p>
                    {person.description}
                  </p>
                </div>
              )
            )}
          </div>
        </section>
      )}

      {/* PHOTO STORY */}
      {images.length > 0 && (
        <section className="magazine-photo-story">
          <div className="magazine-section-title">
            <span>PHOTO STORY</span>

            <h2>
              {data.photoStory?.heading ||
                "Through the Photos"}
            </h2>

            {data.photoStory?.intro && (
              <p>
                {data.photoStory.intro}
              </p>
            )}
          </div>

          <div className="magazine-photo-grid">
            {images.map((image, index) => {
              const idea =
                data.photoStory?.photoIdeas?.[
                  index
                ];

              return (
                <figure
                  key={index}
                  className={`magazine-photo photo-layout-${
                    idea?.layout || "collage"
                  }`}
                >
                  <img
                    src={image.url}
                    alt=""
                  />

                  {idea?.caption && (
                    <figcaption>
                      {idea.caption}
                    </figcaption>
                  )}
                </figure>
              );
            })}
          </div>
        </section>
      )}

      {/* TIMELINE */}
      {data.timeline?.length > 0 && (
        <section className="magazine-timeline">
          <div className="magazine-section-title">
            <span>THE JOURNEY</span>
            <h2>Timeline</h2>
          </div>

          <div className="timeline-list">
            {data.timeline.map(
              (item, index) => (
                <div
                  className="timeline-item"
                  key={index}
                >
                  <span>
                    {String(index + 1).padStart(
                      2,
                      "0"
                    )}
                  </span>

                  <div>
                    <strong>
                      {item.label}
                    </strong>

                    <p>
                      {item.description}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        </section>
      )}

      {/* QUOTE */}
      {data.pullQuote && (
        <section className="magazine-quote">
          <blockquote>
            “{data.pullQuote}”
          </blockquote>
        </section>
      )}

      {/* DETAILS */}
      {data.littleDetails?.length > 0 && (
        <section className="magazine-details">
          <div className="magazine-section-title">
            <span>SMALL THINGS</span>
            <h2>Little Details</h2>
          </div>

          <div className="details-list">
            {data.littleDetails.map(
              (detail, index) => (
                <p key={index}>
                  {detail}
                </p>
              )
            )}
          </div>
        </section>
      )}

      {/* CLOSING */}
      {data.closingNote && (
        <section className="magazine-closing">
          <span>
            {data.closingNote.heading}
          </span>

          <p>
            {data.closingNote.content}
          </p>
        </section>
      )}
    </article>
  );
}