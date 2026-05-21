function CategoryFilter({ value, onChange, categories }) {
  return (
    <label className="input-group">
      Category
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </label>
  )
}

export default CategoryFilter
