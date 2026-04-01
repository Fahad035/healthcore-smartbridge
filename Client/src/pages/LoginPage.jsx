import { Alert, Button, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login({ email, password })
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-5 auth-wrap">
      <Typography variant="h4" className="fw-bold mb-4">Login</Typography>
      {error && <Alert severity="error" className="mb-3">{error}</Alert>}

      <form className="d-grid gap-3" onSubmit={handleSubmit}>
        <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Button variant="contained" size="large" type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>

      <Typography variant="body2" className="mt-3">
        No account yet? <Link to="/register">Create one</Link>
      </Typography>
    </div>
  )
}

export default LoginPage
