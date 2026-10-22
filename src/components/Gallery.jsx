import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";

import useFetchPhotos from "../hooks/useFetchPhotos";
import PhotoCard from "./PhotoCard";
import SearchBar from "./SearchBar";

const initialFavourites = JSON.parse(
  localStorage.getItem("favourites") || "[]"
);

function favouritesReducer(state, action) {
  switch (action.type) {
    case "TOGGLE_FAVOURITE":
      return state.includes(action.id)
        ? state.filter((id) => id !== action.id)
        : [...state, action.id];

    default:
      return state;
  }
}

function Gallery() {
  const { photos, loading, error } = useFetchPhotos();

  const [favourites, dispatch] = useReducer(
    favouritesReducer,
    initialFavourites
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  /*
    Save favourites to localStorage whenever
    the favourites list changes.
  */
  useEffect(() => {
    localStorage.setItem(
      "favourites",
      JSON.stringify(favourites)
    );
  }, [favourites]);

  /*
    Search handler.
    useCallback keeps the same function reference
    between renders.
  */
  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  /*
    Toggle favourite.
    The actual favourite state is controlled
    by useReducer.
  */
  const handleToggleFavourite = useCallback((id) => {
    dispatch({
      type: "TOGGLE_FAVOURITE",
      id,
    });
  }, []);

  /*
    Shuffle the 30 photos received from Picsum.
    No new API request happens here.
  */
  const shuffledPhotos = useMemo(() => {
    const shuffled = [...photos];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [shuffled[i], shuffled[j]] = [
        shuffled[j],
        shuffled[i],
      ];
    }

    return shuffled;
  }, [photos]);

  /*
    Filter the already-fetched photos
    according to the search text.
  */
  const filteredPhotos = useMemo(() => {
    return shuffledPhotos.filter((photo) =>
      photo.author
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [shuffledPhotos, searchTerm]);

  /*
    Open fullscreen photo viewer.
  */
  const handleOpenPhoto = useCallback((photo) => {
    setSelectedPhoto(photo);
  }, []);

  /*
    Close fullscreen photo viewer.
  */
  const handleClosePhoto = useCallback(() => {
    setSelectedPhoto(null);
  }, []);

  /*
    Go to next photo.
  */
  const handleNextPhoto = useCallback(() => {
    if (!selectedPhoto || filteredPhotos.length === 0) {
      return;
    }

    const currentIndex = filteredPhotos.findIndex(
      (photo) => photo.id === selectedPhoto.id
    );

    const nextIndex =
      currentIndex === filteredPhotos.length - 1
        ? 0
        : currentIndex + 1;

    setSelectedPhoto(filteredPhotos[nextIndex]);
  }, [selectedPhoto, filteredPhotos]);

  /*
    Go to previous photo.
  */
  const handlePreviousPhoto = useCallback(() => {
    if (!selectedPhoto || filteredPhotos.length === 0) {
      return;
    }

    const currentIndex = filteredPhotos.findIndex(
      (photo) => photo.id === selectedPhoto.id
    );

    const previousIndex =
      currentIndex === 0
        ? filteredPhotos.length - 1
        : currentIndex - 1;

    setSelectedPhoto(filteredPhotos[previousIndex]);
  }, [selectedPhoto, filteredPhotos]);

  /*
    Loading state.
  */
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f1eb]">
        <div className="text-center">
          <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-2 border-black/15 border-t-black" />

          <p className="text-[11px] font-medium tracking-[0.3em] text-black/50 uppercase">
            Loading photographs
          </p>
        </div>
      </div>
    );
  }

  /*
    Error state.
  */
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f1eb] px-6">
        <div className="max-w-md text-center">
          <p className="mb-3 text-[11px] font-semibold tracking-[0.25em] text-black/40 uppercase">
            Gallery unavailable
          </p>

          <h2 className="mb-3 font-serif text-4xl italic">
            Something went wrong.
          </h2>

          <p className="text-sm leading-6 text-black/55">
            We couldn't load the photographs. Please check your
            connection and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f1eb] text-[#111318]">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">

        {/* ================= NAVIGATION ================= */}

        <nav className="flex items-center justify-between border-b border-black/10 py-6">
          <p className="text-sm font-bold tracking-[0.25em]">
            FRAME.
          </p>

          <p className="hidden text-[10px] font-medium tracking-[0.25em] text-black/45 uppercase sm:block">
            Digital Photo Archive
          </p>

          <p className="text-[10px] font-medium tracking-[0.2em] text-black/45 uppercase">
            2026
          </p>
        </nav>

        {/* ================= HERO ================= */}

        <header className="border-b border-black/10 py-12 sm:py-16 lg:py-20">

          {/* Small top label */}
          <div className="mb-10 flex items-center justify-between">
            <p className="text-[11px] font-semibold tracking-[0.3em] text-black/45 uppercase">
              Visual Archive / 001
            </p>

            <p className="hidden text-[10px] tracking-[0.2em] text-black/35 uppercase sm:block">
              30 Photographs
            </p>
          </div>

          {/* Hero content */}
          <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">

            {/* LEFT — Typography */}
            <div>
              <p className="mb-6 text-[10px] font-medium tracking-[0.3em] text-black/35 uppercase">
                A collection of visual stories
              </p>

              <h1 className="text-[clamp(4rem,9vw,9rem)] font-semibold leading-[0.8] tracking-[-0.065em]">
                Moments
                <br />

                <span className="font-serif font-normal italic">
                  captured.
                </span>
              </h1>

              <div className="mt-10 flex items-center gap-4">
                <span className="h-px w-12 bg-black/30" />

                <p className="text-[10px] tracking-[0.25em] text-black/40 uppercase">
                  Explore the archive
                </p>
              </div>
            </div>

            {/* RIGHT — Picsum image collage */}
            <div className="relative mx-auto h-[420px] w-full max-w-[560px]">

              {/* Back image */}
              {shuffledPhotos[2] && (
                <div className="absolute right-0 top-0 h-[230px] w-[48%] overflow-hidden">
                  <img
                    src={shuffledPhotos[2].download_url}
                    alt={`Photo by ${shuffledPhotos[2].author}`}
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute bottom-3 left-3 bg-[#f4f1eb] px-2 py-1">
                    <p className="text-[8px] tracking-[0.2em] uppercase">
                      03
                    </p>
                  </div>
                </div>
              )}

              {/* Main image */}
              {shuffledPhotos[0] && (
                <div className="absolute left-0 top-12 z-10 h-[310px] w-[60%] overflow-hidden border-[6px] border-[#f4f1eb] shadow-xl">
                  <img
                    src={shuffledPhotos[0].download_url}
                    alt={`Photo by ${shuffledPhotos[0].author}`}
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute bottom-4 left-4 bg-[#f4f1eb] px-3 py-1.5">
                    <p className="text-[9px] font-semibold tracking-[0.2em] uppercase">
                      01 / Featured
                    </p>
                  </div>
                </div>
              )}

              {/* Front image */}
              {shuffledPhotos[1] && (
                <div className="absolute bottom-0 right-[4%] z-20 h-[210px] w-[48%] overflow-hidden border-[6px] border-[#f4f1eb] shadow-xl">
                  <img
                    src={shuffledPhotos[1].download_url}
                    alt={`Photo by ${shuffledPhotos[1].author}`}
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute right-3 top-3 bg-[#f4f1eb] px-2 py-1">
                    <p className="text-[8px] tracking-[0.2em] uppercase">
                      02
                    </p>
                  </div>
                </div>
              )}

              {/* Decorative circle */}
              <div className="absolute -bottom-4 left-[45%] z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#111318] text-[9px] tracking-[0.15em] text-white uppercase">
                30
              </div>
            </div>
          </div>

          {/* Hero bottom information */}
          <div className="mt-14 grid gap-8 border-t border-black/10 pt-8 sm:grid-cols-3">

            <div>
              <p className="text-3xl font-semibold tracking-tight">
                {photos.length}
              </p>

              <p className="mt-1 text-[10px] tracking-[0.2em] text-black/40 uppercase">
                Photographs
              </p>
            </div>

            <div>
              <p className="text-3xl font-semibold tracking-tight">
                {favourites.length}
              </p>

              <p className="mt-1 text-[10px] tracking-[0.2em] text-black/40 uppercase">
                Favourites
              </p>
            </div>

            <div className="max-w-md sm:ml-auto">
              <p className="text-sm leading-6 text-black/55">
                A collection of photographs gathered from creators
                around the world. Search the archive by author and
                keep the moments that speak to you.
              </p>
            </div>

          </div>
        </header>

        {/* ================= SEARCH ================= */}

        <section className="py-10 sm:py-12">
          <SearchBar
            searchTerm={searchTerm}
            onSearch={handleSearch}
          />
        </section>

        {/* ================= COLLECTION HEADER ================= */}

        <div className="mb-8 flex items-end justify-between border-b border-black/10 pb-5">

          <div>
            <p className="mb-2 text-[10px] font-semibold tracking-[0.28em] text-black/40 uppercase">
              Selected Works
            </p>

            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              The Collection
            </h2>
          </div>

          <p className="text-[11px] font-medium tracking-[0.18em] text-black/45 uppercase">
            {filteredPhotos.length.toString().padStart(2, "0")} /{" "}
            {photos.length.toString().padStart(2, "0")}
          </p>
        </div>

        {/* ================= GALLERY ================= */}

        {filteredPhotos.length === 0 ? (
          <div className="border border-dashed border-black/20 py-24 text-center">

            <p className="font-serif text-3xl italic">
              No photographs found.
            </p>

            <p className="mt-3 text-sm text-black/45">
              Try searching for another author.
            </p>

          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-5 gap-y-12 md:grid-cols-2 lg:grid-cols-4">

            {filteredPhotos.map((photo, index) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                index={index}
                isFavourite={favourites.includes(photo.id)}
                onToggleFavourite={handleToggleFavourite}
                onOpen={handleOpenPhoto}
              />
            ))}

          </div>
        )}

        {/* ================= FOOTER ================= */}

        <footer className="mt-24 flex flex-col gap-3 border-t border-black/10 py-8 text-[10px] font-medium tracking-[0.2em] text-black/40 uppercase sm:flex-row sm:items-center sm:justify-between">
          <p>FRAME. / PHOTO ARCHIVE</p>

          <p>Built with React + Tailwind</p>
        </footer>
      </div>

      {/* ================= FULLSCREEN PHOTO VIEWER ================= */}

      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 sm:p-8">

          {/* Close */}
          <button
            onClick={handleClosePhoto}
            className="absolute right-5 top-5 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/20"
            aria-label="Close photo viewer"
          >
            ×
          </button>

          {/* Previous */}
          <button
            onClick={handlePreviousPhoto}
            className="absolute left-4 top-1/2 z-50 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/20 sm:left-8"
            aria-label="Previous photo"
          >
            ←
          </button>

          {/* Main image */}
          <div className="flex max-h-[92vh] max-w-[90vw] flex-col items-center">

            <img
              src={selectedPhoto.download_url}
              alt={`Photo by ${selectedPhoto.author}`}
              className="max-h-[78vh] max-w-full object-contain"
            />

            <div className="mt-5 text-center text-white">

              <p className="text-sm font-medium">
                {selectedPhoto.author}
              </p>

              <p className="mt-1 text-[10px] tracking-[0.25em] text-white/50 uppercase">
                Photographer
              </p>

            </div>
          </div>

          {/* Next */}
          <button
            onClick={handleNextPhoto}
            className="absolute right-4 top-1/2 z-50 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/20 sm:right-8"
            aria-label="Next photo"
          >
            →
          </button>
        </div>
      )}
    </main>
  );
}

export default Gallery;