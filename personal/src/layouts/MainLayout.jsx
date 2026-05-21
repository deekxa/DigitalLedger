import { useEffect, useRef, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useExpenses } from '../hooks/useExpenses'

function MainLayout() {
  const expenseStore = useExpenses()
  const { budgetStatus, budgetNotification } = expenseStore
  const [toast, setToast] = useState(null)
  const previousStatusRef = useRef(null)

  useEffect(() => {
    const previousStatus = previousStatusRef.current
    const isAlertStatus = budgetStatus === 'warning' || budgetStatus === 'danger'

    if (isAlertStatus && previousStatus !== budgetStatus) {
      setToast({
        level: budgetStatus,
        message: budgetNotification.message,
      })
    }

    previousStatusRef.current = budgetStatus
  }, [budgetNotification.message, budgetStatus])

  useEffect(() => {
    if (!toast) {
      return
    }

    const timer = window.setTimeout(() => {
      setToast(null)
    }, 5000)

    return () => {
      window.clearTimeout(timer)
    }
  }, [toast])

  return (
    <div className="app-shell">
      {toast && (
        <div className={`toast-notice toast-${toast.level}`} role="status" aria-live="polite">
          <span>{toast.message}</span>
          <button type="button" aria-label="Dismiss notification" onClick={() => setToast(null)}>
            ×
          </button>
        </div>
      )}
      <Navbar />
      <main className="content-shell">
        <Outlet context={expenseStore} />
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout
