export function calculateTotal(expenses) {
  return expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0)
}
