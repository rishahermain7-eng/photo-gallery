function SearchBar({ searchTerm, onSearch }) {
  return (
    <div className="flex max-w-3xl items-center gap-5 border-b-2 border-black/15 pb-4 transition focus-within:border-black">
      <span className="shrink-0 text-[10px] font-semibold tracking-[0.25em] text-black/35 uppercase">
        Search
      </span>

      <input
        type="text"
        value={searchTerm}
        onChange={(event) => onSearch(event.target.value)}
        placeholder="Type an author's name..."
        className="min-w-0 flex-1 bg-transparent text-lg outline-none placeholder:text-black/25 sm:text-xl"
        aria-label="Search photos by author"
      />

      <span className="text-xl text-black/35">
        ⌕
      </span>
    </div>
  );
}

export default SearchBar;