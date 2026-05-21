import { useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import SummaryCard from '../components/SummaryCard'
import ExpenseList from '../components/ExpenseList'
import { calculateTotal } from '../utils/calculateTotal'
import { formatCurrency } from '../utils/formatCurrency'

function Dashboard() {
  const {
    expenses,
    salary,
    remainingBalance,
    usagePercent,
    budgetNotification,
    updateSalary,
  } = useOutletContext()
  const [salaryInput, setSalaryInput] = useState(salary > 0 ? String(salary) : '')

  const totalExpense = useMemo(() => calculateTotal(expenses), [expenses])

  const categoryTotals = useMemo(() => {
    const totals = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + Number(expense.amount)
      return acc
    }, {})

    return Object.entries(totals)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
  }, [expenses])

  const recentTransactions = useMemo(() => {
    return [...expenses]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3)
  }, [expenses])

  const topCategory = categoryTotals[0]

  function handleSalarySubmit(event) {
    event.preventDefault()
    updateSalary(salaryInput)
  }

  return (
    <section className="dashboard-page stack-lg">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Track your spending health at a glance.</p>
      </div>

      <article className="panel budget-panel">
        <div className="budget-head">
          <h2>Salary Budget</h2>
          <p>Set your monthly salary and monitor budget usage in real time.</p>
        </div>

        <form className="budget-form" onSubmit={handleSalarySubmit}>
          <label>
            Monthly Salary (NPR)
            <input
              type="number"
              min="0"
              step="1"
              value={salaryInput}
              onChange={(event) => setSalaryInput(event.target.value)}
              placeholder="Enter monthly salary"
              required
            />
          </label>
          <button type="submit" className="btn btn-primary">
            Save Salary
          </button>
        </form>

        <div className={`budget-alert budget-alert-${budgetNotification.level}`}>
          {budgetNotification.message}
        </div>
      </article>

      <div className="summary-grid">
        <SummaryCard
          title="Monthly Salary"
          value={salary > 0 ? formatCurrency(salary) : 'Not set'}
          subtitle="Current budget baseline"
        />
        <SummaryCard
          title="Total Expenses"
          value={formatCurrency(totalExpense)}
          subtitle="Across all transactions"
        />
        <SummaryCard
          title="Remaining Balance"
          value={salary > 0 ? formatCurrency(remainingBalance) : 'Set salary first'}
          subtitle={salary > 0 ? `${usagePercent.toFixed(0)}% budget used` : 'No budget tracking yet'}
        />
      </div>

      <div className="summary-grid">
        <SummaryCard
          title="Top Category"
          value={topCategory ? topCategory.category : 'N/A'}
          subtitle={
            topCategory
              ? `${formatCurrency(topCategory.amount)} spent`
              : 'No expenses yet'
          }
        />
        <SummaryCard
          title="Transactions"
          value={String(expenses.length)}
          subtitle="Recorded so far"
        />
      </div>

      <article className="panel">
        <h2>Category Summary</h2>
        <div className="category-bars">
          {categoryTotals.length === 0 && <p className="empty-state">No category data yet.</p>}
          {categoryTotals.map((item) => {
            const percent = totalExpense > 0 ? (item.amount / totalExpense) * 100 : 0
            return (
              <div key={item.category} className="bar-row">
                <div className="bar-head">
                  <span>{item.category}</span>
                  <strong>{percent.toFixed(0)}%</strong>
                </div>
                <div className="bar-track">
                  <span style={{ width: `${percent}%` }}></span>
                </div>
              </div>
            )
          })}
        </div>
      </article>

      <article className="panel">
        <h2>Recent Transactions</h2>
        <ExpenseList expenses={recentTransactions} />
      </article>
    </section>
  )
}

export default Dashboard
