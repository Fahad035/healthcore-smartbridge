import { Navigate, Route, Routes } from 'react-router-dom'
import { CssBaseline } from '@mui/material'
import TopNav from './components/TopNav'
import ProtectedRoute from './components/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ApplyDoctorPage from './pages/ApplyDoctorPage'
import DoctorDashboardPage from './pages/DoctorDashboardPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import './App.css'

function App() {
  return (
    <>
      <CssBaseline />
      <TopNav />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/apply-doctor" element={<ApplyDoctorPage />} />
        </Route>

        <Route element={<ProtectedRoute roles={['doctor']} />}>
          <Route path="/doctor" element={<DoctorDashboardPage />} />
        </Route>

        <Route element={<ProtectedRoute roles={['admin']} />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
