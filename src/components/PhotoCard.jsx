function PhotoCard({
  photo,
  index,
  isFavourite,
  onToggleFavourite,
  onOpen,
}) {
  return (
    <article className="group">
      <div className="relative overflow-hidden bg-black">
        <button
          onClick={() => onOpen(photo)}
          className="block w-full cursor-zoom-in text-left"
          aria-label={`Open photo by ${photo.author}`}
        >
          <img
            src={photo.download_url}
            alt={`Photo by ${photo.author}`}
            className="h-72 w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04] sm:h-80"
          />
        </button>

        {/* Number */}
        <div className="absolute left-4 top-4 bg-[#f4f1eb] px-3 py-1">
          <span className="text-[10px] font-semibold tracking-[0.2em]">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        {/* Favourite */}
        <button
          onClick={(event) => {
            event.stopPropagation();
            onToggleFavourite(photo.id);
          }}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#f4f1eb] text-xl transition duration-200 hover:scale-110"
          aria-label={
            isFavourite
              ? "Remove from favourites"
              : "Add to favourites"
          }
        >
          {isFavourite ? "♥" : "♡"}
        </button>
      </div>

      {/* Photo information */}
      <div className="flex items-start justify-between gap-4 pt-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-[#111318]">
            {photo.author}
          </p>

          <p className="mt-1 text-[10px] tracking-[0.2em] text-black/40 uppercase">
            Photographer
          </p>
        </div>

        <span className="text-[10px] tracking-[0.15em] text-black/30">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
    </article>
  );
}

export default PhotoCard;