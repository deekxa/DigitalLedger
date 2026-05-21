import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)
const AUTH_KEY = 'campus-spend-auth'
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/

function readStoredUser() {
  const raw = localStorage.getItem(AUTH_KEY)
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredUser())

  useEffect(() => {
    if (!user) {
      localStorage.removeItem(AUTH_KEY)
      return
    }
    localStorage.setItem(AUTH_KEY, JSON.stringify(user))
  }, [user])

  function login({ email, password }) {
    if (!email || !password) {
      return { ok: false, message: 'Email and password are required.' }
    }

    if (!emailPattern.test(email)) {
      return { ok: false, message: 'Enter a valid email address.' }
    }

    if (!passwordPattern.test(password)) {
      return {
        ok: false,
        message: 'Password must be at least 6 characters and include letters and numbers.',
      }
    }

    const loggedInUser = {
      name: 'Personal User',
      email,
    }

    setUser(loggedInUser)
    return { ok: true }
  }

  function logout() {
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
