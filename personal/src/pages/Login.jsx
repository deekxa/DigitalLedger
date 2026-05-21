import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Login() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('personal@digitalledger.com')
  const [password, setPassword] = useState('personal123')
  const [error, setError] = useState('')

  const destination = location.state?.from?.pathname || '/'

  if (isAuthenticated) {
    return <Navigate to={destination} replace />
  }

  function handleSubmit(event) {
    event.preventDefault()
    const result = login({ email, password })
    if (!result.ok) {
      setError(result.message)
      return
    }

    navigate(destination, { replace: true })
  }

  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Sign In</h1>
        <p>Login to manage your personal college expenses.</p>
        <p className="auth-help">Use a valid email and a password with letters and numbers.</p>

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        {error && <p className="form-error">{error}</p>}

        <button type="submit" className="btn btn-primary">
          Continue
        </button>
      </form>
    </section>
  )
}

export default Login
