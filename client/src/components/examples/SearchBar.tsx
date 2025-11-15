import SearchBar from "../SearchBar";

export default function SearchBarExample() {
  return (
    <div className="p-8 max-w-3xl">
      <SearchBar 
        placeholder="Search AI tools..."
        onSearch={(query) => console.log("Search query:", query)}
      />
    </div>
  );
}
