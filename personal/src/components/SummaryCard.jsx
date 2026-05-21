function SummaryCard({ title, value, subtitle }) {
  return (
    <article className="summary-card">
      <p>{title}</p>
      <h3>{value}</h3>
      {subtitle && <small>{subtitle}</small>}
    </article>
  )
}

export default SummaryCard
