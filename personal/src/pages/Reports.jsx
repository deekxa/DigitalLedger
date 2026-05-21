import { useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { calculateTotal } from '../utils/calculateTotal'
import { exportReportsCSV, exportReportsPDF } from '../utils/exportReports'
import { formatCurrency } from '../utils/formatCurrency'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const chartColors = ['#ea580c', '#16a34a', '#2563eb', '#9333ea', '#dc2626', '#0891b2']

function Reports() {
  const { expenses } = useOutletContext()
  const [isExportingPdf, setIsExportingPdf] = useState(false)

  const monthlyTotals = useMemo(() => {
    const map = expenses.reduce((acc, expense) => {
      const month = new Date(expense.date).toLocaleString('ne-NP', {
        month: 'short',
        year: 'numeric',
      })
      acc[month] = (acc[month] || 0) + Number(expense.amount)
      return acc
    }, {})

    return Object.entries(map)
      .map(([month, amount]) => ({ month, amount }))
      .sort((a, b) => b.amount - a.amount)
  }, [expenses])

  const total = useMemo(() => calculateTotal(expenses), [expenses])

  const categoryStats = useMemo(() => {
    const map = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + Number(expense.amount)
      return acc
    }, {})

    return Object.entries(map)
      .map(([category, amount]) => ({
        category,
        amount,
        percent: total > 0 ? (amount / total) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount)
  }, [expenses, total])

  async function handleExportPdf() {
    if (isExportingPdf) {
      return
    }

    try {
      setIsExportingPdf(true)
      await exportReportsPDF(expenses)
    } finally {
      setIsExportingPdf(false)
    }
  }

  return (
    <section className="reports-page stack-lg">
      <div className="page-header">
        <h1>Reports</h1>
        <p>Analyze monthly trends and spending statistics.</p>
      </div>

      <div className="report-actions">
        <button type="button" className="btn btn-secondary" onClick={() => exportReportsCSV(expenses)}>
          Export CSV
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleExportPdf}
          disabled={isExportingPdf}
        >
          {isExportingPdf ? 'Preparing PDF...' : 'Export PDF'}
        </button>
      </div>

      <article className="panel">
        <h2>Monthly Expense</h2>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyTotals} margin={{ left: -22, right: 10, top: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1dfcc" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="amount" fill="#ea580c" name="Monthly Expense" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="report-grid">
          {monthlyTotals.length === 0 && <p className="empty-state">No monthly data available.</p>}
          {monthlyTotals.map((item) => (
            <div key={item.month} className="report-card">
              <p>{item.month}</p>
              <strong>{formatCurrency(item.amount)}</strong>
            </div>
          ))}
        </div>
      </article>

      <article className="panel">
        <h2>Expense Statistics</h2>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={categoryStats}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={108}
                paddingAngle={2}
                label={false}
                labelLine={false}
              >
                {categoryStats.map((entry, index) => (
                  <Cell key={entry.category} fill={chartColors[index % chartColors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="category-bars">
          {categoryStats.length === 0 && <p className="empty-state">No category statistics yet.</p>}
          {categoryStats.map((item) => (
            <div key={item.category} className="bar-row">
              <div className="bar-head">
                <span>{item.category}</span>
                <strong>{item.percent.toFixed(0)}%</strong>
              </div>
              <div className="bar-track">
                <span style={{ width: `${item.percent}%` }}></span>
              </div>
            </div>
          ))}
        </div>
      </article>
    </section>
  )
}

export default Reports
