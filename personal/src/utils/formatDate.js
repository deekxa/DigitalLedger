export function formatDate(dateValue) {
  return new Intl.DateTimeFormat('ne-NP', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateValue))
}
