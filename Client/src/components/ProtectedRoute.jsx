import { Navigate, Outlet } from 'react-router-dom'
import { CircularProgress } from '@mui/material'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ roles }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <CircularProgress />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
