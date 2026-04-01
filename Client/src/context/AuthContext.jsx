/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useCallback } from 'react'
import http from '../api/http'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [doctorProfile, setDoctorProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadCurrentUser = useCallback(async () => {
    const token = localStorage.getItem('bookDoctorToken')
    if (!token) {
      setUser(null)
      setDoctorProfile(null)
      setLoading(false)
      return
    }

    try {
      const { data } = await http.get('/auth/me')
      setUser(data.user)
      setDoctorProfile(data.doctorProfile)
    } catch {
      localStorage.removeItem('bookDoctorToken')
      setUser(null)
      setDoctorProfile(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCurrentUser()
  }, [loadCurrentUser])

  const register = useCallback(async (payload) => {
    const { data } = await http.post('/auth/register', payload)
    localStorage.setItem('bookDoctorToken', data.token)
    await loadCurrentUser()
    return data
  }, [loadCurrentUser])

  const login = useCallback(async (payload) => {
    const { data } = await http.post('/auth/login', payload)
    localStorage.setItem('bookDoctorToken', data.token)
    await loadCurrentUser()
    return data
  }, [loadCurrentUser])

  const logout = useCallback(() => {
    localStorage.removeItem('bookDoctorToken')
    setUser(null)
    setDoctorProfile(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      doctorProfile,
      loading,
      register,
      login,
      logout,
      refreshMe: loadCurrentUser,
    }),
    [user, doctorProfile, loading, register, login, logout, loadCurrentUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return ctx
}
