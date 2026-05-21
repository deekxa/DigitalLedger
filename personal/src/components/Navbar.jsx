import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

function navClass({ isActive }) {
  return isActive ? 'nav-link active' : 'nav-link'
}

function Navbar() {
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()

  return (
    <header className="site-header">
      <div className="site-main">
        <div className="site-logo">
          <span className="logo-dot" aria-hidden="true"></span>
          Digital Ledger
        </div>

        <nav className="site-nav" aria-label="Primary navigation">
          <NavLink to="/" end className={navClass}>
            Dashboard
          </NavLink>
          <NavLink to="/expenses" className={navClass}>
            Expenses
          </NavLink>
          <NavLink to="/reports" className={navClass}>
            Reports
          </NavLink>
        </nav>
      </div>

      <div className="site-actions">
        <span className="user-email">{user?.email || 'personal@digitalledger.com'}</span>
        <button type="button" className="btn btn-secondary" onClick={toggleTheme}>
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  )
}

export default Navbar
