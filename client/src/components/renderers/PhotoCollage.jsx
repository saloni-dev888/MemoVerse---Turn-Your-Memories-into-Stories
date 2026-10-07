export default function PhotoCollage({
  images = [],
  layout = "auto",
}) {
  if (!images.length) {
    return null;
  }

  const getLayout = () => {
    if (layout !== "auto") {
      return layout;
    }

    if (images.length === 1) {
      return "hero";
    }

    if (images.length === 2) {
      return "split";
    }

    if (images.length === 3) {
      return "feature-three";
    }

    if (images.length === 4) {
      return "balanced";
    }

    if (images.length <= 6) {
      return "editorial";
    }

    return "gallery";
  };

  const selectedLayout = getLayout();

  return (
    <div
      className={`photo-collage photo-collage-${selectedLayout}`}
    >
      {images.map((image, index) => (
        <figure
          className="photo-collage-item"
          key={index}
        >
          <img
            src={image.url}
            alt={image.originalName || ""}
            loading="lazy"
          />

          <span>
            {index + 1}
          </span>
        </figure>
      ))}
    </div>
  );
}