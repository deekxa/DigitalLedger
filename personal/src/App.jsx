import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

const MainLayout = lazy(() => import('./layouts/MainLayout'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Expenses = lazy(() => import('./pages/Expenses'))
const Reports = lazy(() => import('./pages/Reports'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))
const Login = lazy(() => import('./pages/Login'))
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'))

function RouteLoader() {
  return (
    <div className="route-loading" role="status" aria-live="polite">
      <span className="route-loading-spinner" aria-hidden="true"></span>
      Loading your workspace...
    </div>
  )
}

function App() {
  return (
    <Suspense fallback={<RouteLoader />}>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="reports" element={<Reports />} />
          </Route>
        </Route>

        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}

export default App
