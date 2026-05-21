function SearchBar({ value, onChange }) {
  return (
    <label className="input-group">
      Search
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by title or note"
      />
    </label>
  )
}

export default SearchBar
