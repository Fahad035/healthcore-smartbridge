import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const TopNav = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: '1px solid #d9dfe8' }}>
      <Toolbar className="container d-flex justify-content-between">
        <Box component={Link} to="/" className="brand-link d-flex align-items-center gap-2">
          <img src="/doctor_logo.jpg" alt="Doctor logo" className="brand-logo" />
          <span>
            <Typography variant="h6" className="brand-title fw-bold">HealthCore</Typography>
            <Typography variant="caption" className="brand-subtitle">SmartBridge Health Platform</Typography>
          </span>
        </Box>
        <Box className="d-flex gap-2 align-items-center">
          {user ? (
            <>
              <Typography variant="body2" className="text-muted">
                {user.name} ({user.role})
              </Typography>
              <Button onClick={() => navigate('/dashboard')}>Dashboard</Button>
              <Button variant="outlined" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => navigate('/login')}>Login</Button>
              <Button variant="contained" onClick={() => navigate('/register')}>
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default TopNav
