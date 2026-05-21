import { useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import ExpenseForm from '../components/ExpenseForm'
import ExpenseList from '../components/ExpenseList'
import CategoryFilter from '../components/CategoryFilter'
import SearchBar from '../components/SearchBar'
import { filterExpenses } from '../utils/filterExpenses'

function Expenses() {
  const {
    expenses,
    categories,
    addExpense,
    updateExpense,
    deleteExpense,
    budgetNotification,
  } = useOutletContext()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [editingExpense, setEditingExpense] = useState(null)
  const [pendingDeleteId, setPendingDeleteId] = useState(null)

  const filteredExpenses = useMemo(() => {
    return filterExpenses(expenses, {
      searchTerm,
      category: selectedCategory,
    })
  }, [expenses, searchTerm, selectedCategory])

  function handleCreateExpense(payload) {
    addExpense(payload)
  }

  function handleUpdateExpense(payload) {
    if (!editingExpense) {
      return
    }
    updateExpense(editingExpense.id, payload)
    setEditingExpense(null)
  }

  function handleStartEdit(expense) {
    setEditingExpense(expense)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleAskDelete(id) {
    setPendingDeleteId(id)
  }

  function handleConfirmDelete() {
    if (pendingDeleteId) {
      deleteExpense(pendingDeleteId)
      setPendingDeleteId(null)
    }
  }

  return (
    <section className="expenses-page stack-lg">
      <div className="page-header">
        <h1>Expenses</h1>
        <p>Add, edit, delete, search and filter all your transactions.</p>
      </div>

      <div className={`budget-alert budget-alert-${budgetNotification.level}`}>
        {budgetNotification.message}
      </div>

      <article className="panel">
        <h2>{editingExpense ? 'Edit Expense' : 'Add Expense'}</h2>
        <ExpenseForm
          onSubmit={editingExpense ? handleUpdateExpense : handleCreateExpense}
          initialValues={editingExpense}
          submitLabel={editingExpense ? 'Save Changes' : 'Add Expense'}
          onCancel={editingExpense ? () => setEditingExpense(null) : undefined}
        />
      </article>

      <article className="panel">
        <div className="toolbar">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          <CategoryFilter
            value={selectedCategory}
            onChange={setSelectedCategory}
            categories={categories}
          />
        </div>

        <ExpenseList
          expenses={filteredExpenses}
          onEdit={handleStartEdit}
          onDelete={handleAskDelete}
        />
      </article>

      {pendingDeleteId && (
        <div className="confirm-overlay" role="dialog" aria-modal="true" aria-label="Delete expense">
          <div className="confirm-modal">
            <h3>Delete Expense?</h3>
            <p>This action cannot be undone. Do you want to continue?</p>
            <div className="confirm-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setPendingDeleteId(null)}>
                Cancel
              </button>
              <button type="button" className="btn btn-danger" onClick={handleConfirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Expenses
