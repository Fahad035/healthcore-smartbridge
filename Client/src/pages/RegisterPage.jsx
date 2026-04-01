import { Alert, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const RegisterPage = () => {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'patient',
    adminInviteCode: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await register(form)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-5 auth-wrap">
      <Typography variant="h4" className="fw-bold mb-4">Create Account</Typography>
      {error && <Alert severity="error" className="mb-3">{error}</Alert>}
      <form className="d-grid gap-3" onSubmit={handleSubmit}>
        <TextField label="Full Name" value={form.name} onChange={handleChange('name')} required />
        <TextField label="Email" type="email" value={form.email} onChange={handleChange('email')} required />
        <TextField label="Password" type="password" value={form.password} onChange={handleChange('password')} required />
        <TextField label="Phone" value={form.phone} onChange={handleChange('phone')} />

        <FormControl>
          <InputLabel id="role-label">Role</InputLabel>
          <Select labelId="role-label" label="Role" value={form.role} onChange={handleChange('role')}>
            <MenuItem value="patient">User (Patient)</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        </FormControl>

        {form.role === 'admin' && (
          <TextField
            label="Admin Invite Code"
            type="password"
            value={form.adminInviteCode}
            onChange={handleChange('adminInviteCode')}
            required
          />
        )}

        <Button variant="contained" size="large" type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </Button>
      </form>

      <Typography variant="body2" className="mt-3">
        Already have an account? <Link to="/login">Login</Link>
      </Typography>
    </div>
  )
}

export default RegisterPage
