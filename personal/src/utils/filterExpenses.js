export function filterExpenses(expenses, { searchTerm = '', category = 'All' }) {
  const normalizedSearch = searchTerm.trim().toLowerCase()

  return expenses.filter((expense) => {
    const matchesCategory =
      category === 'All' || expense.category.toLowerCase() === category.toLowerCase()

    const matchesSearch =
      normalizedSearch.length === 0 ||
      expense.title.toLowerCase().includes(normalizedSearch) ||
      (expense.note || '').toLowerCase().includes(normalizedSearch)

    return matchesCategory && matchesSearch
  })
}
