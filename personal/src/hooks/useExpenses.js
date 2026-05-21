import { useEffect, useMemo, useState } from 'react'
import { expensesData } from '../data/expensesData'
import { calculateTotal } from '../utils/calculateTotal'

const EXPENSES_KEY = 'campus-spend-expenses'
const SALARY_KEY = 'digital-ledger-salary'

function readStoredExpenses() {
  const raw = localStorage.getItem(EXPENSES_KEY)
  if (!raw) {
    return expensesData
  }

  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : expensesData
  } catch {
    return expensesData
  }
}

function readStoredSalary() {
  const raw = localStorage.getItem(SALARY_KEY)
  if (!raw) {
    return 0
  }

  const parsed = Number(raw)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0
}

export function useExpenses() {
  const [expenses, setExpenses] = useState(() => readStoredExpenses())
  const [salary, setSalary] = useState(() => readStoredSalary())

  useEffect(() => {
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses))
  }, [expenses])

  useEffect(() => {
    localStorage.setItem(SALARY_KEY, String(salary))
  }, [salary])

  const totalExpense = useMemo(() => calculateTotal(expenses), [expenses])
  const remainingBalance = useMemo(() => salary - totalExpense, [salary, totalExpense])

  const usagePercent = useMemo(() => {
    if (salary <= 0) {
      return 0
    }
    return (totalExpense / salary) * 100
  }, [salary, totalExpense])

  const budgetStatus = useMemo(() => {
    if (salary <= 0) {
      return 'none'
    }
    if (usagePercent >= 100) {
      return 'danger'
    }
    if (usagePercent >= 80) {
      return 'warning'
    }
    return 'healthy'
  }, [salary, usagePercent])

  const categories = useMemo(() => {
    const values = new Set(expenses.map((expense) => expense.category))
    return ['All', ...values]
  }, [expenses])

  function addExpense(payload) {
    const newExpense = {
      id: crypto.randomUUID(),
      ...payload,
      amount: Number(payload.amount),
    }
    setExpenses((current) => [newExpense, ...current])
  }

  function updateExpense(id, payload) {
    setExpenses((current) =>
      current.map((expense) =>
        expense.id === id ? { ...expense, ...payload, amount: Number(payload.amount) } : expense,
      ),
    )
  }

  function deleteExpense(id) {
    setExpenses((current) => current.filter((expense) => expense.id !== id))
  }

  function updateSalary(nextSalary) {
    const value = Number(nextSalary)
    setSalary(Number.isFinite(value) && value >= 0 ? value : 0)
  }

  const budgetNotification = useMemo(() => {
    if (salary <= 0) {
      return {
        level: 'info',
        message: 'Set your monthly salary to start budget tracking.',
      }
    }

    if (budgetStatus === 'danger') {
      return {
        level: 'danger',
        message: 'Alert: Your expenses exceeded your salary budget.',
      }
    }

    if (budgetStatus === 'warning') {
      return {
        level: 'warning',
        message: 'Warning: You have used more than 80% of your salary budget.',
      }
    }

    return {
      level: 'healthy',
      message: 'Great: Your spending is within a healthy budget range.',
    }
  }, [budgetStatus, salary])

  return {
    expenses,
    salary,
    totalExpense,
    remainingBalance,
    usagePercent,
    budgetStatus,
    budgetNotification,
    categories,
    addExpense,
    updateExpense,
    deleteExpense,
    updateSalary,
  }
}
