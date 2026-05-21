export function formatCurrency(amount) {
  const value = Number(amount || 0)
  return `NPR ${value.toLocaleString('ne-NP')}`
}
