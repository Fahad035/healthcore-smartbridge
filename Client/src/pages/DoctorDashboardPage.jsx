import { Alert, Button, Card, CardContent, Chip, MenuItem, TextField, Typography, Box, Paper, Badge, Tab, Tabs, LinearProgress } from '@mui/material'
import { useEffect, useState, useCallback } from 'react'
import dayjs from 'dayjs'
import http from '../api/http'

const DoctorDashboardPage = () => {
  const [appointments, setAppointments] = useState([])
  const [error, setError] = useState('')
  const [tabValue, setTabValue] = useState(0)
  const [availability, setAvailability] = useState([
    { day: 'Monday', startTime: '09:00', endTime: '16:00', isAvailable: true },
    { day: 'Tuesday', startTime: '09:00', endTime: '16:00', isAvailable: true },
  ])

  const getStatusColor = useCallback((status) => {
    const colors = { pending: 'warning', confirmed: 'success', rejected: 'error', completed: 'info' }
    return colors[status] || 'default'
  }, [])

  const loadData = async () => {
    try {
      const { data } = await http.get('/doctor/appointments')
      setAppointments(data.appointments || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load doctor dashboard')
    }
  }

  useEffect(() => {
    const timerId = setTimeout(() => {
      loadData()
    }, 0)

    return () => clearTimeout(timerId)
  }, [])

  const updateStatus = async (id, status) => {
    try {
      await http.patch(`/doctor/appointments/${id}/status`, { status })
      await loadData()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update appointment')
    }
  }

  const saveAvailability = async () => {
    try {
      await http.put('/doctor/availability', { availability })
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update availability')
    }
  }

  const pendingCount = appointments.filter(a => a.status === 'pending').length
  const confirmedCount = appointments.filter(a => a.status === 'confirmed').length

  return (
    <div className="doctor-dashboard-wrapper">
      <Box className="doctor-dashboard-header">
        <Typography variant="h4" className="fw-bold">👨‍⚕️ My Dashboard</Typography>
        <Typography variant="body2" className="text-muted">Manage your appointments and availability</Typography>
      </Box>

      <div className="container py-5">
        {/* Stats Cards */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <Paper className="stat-card stat-card-pending fadeInUp">
              <Typography variant="h5" className="fw-bold text-warning">{pendingCount}</Typography>
              <Typography variant="body2" className="text-muted">Pending Requests</Typography>
            </Paper>
          </div>
          <div className="col-md-4">
            <Paper className="stat-card stat-card-confirmed fadeInUp" style={{ animationDelay: '0.1s' }}>
              <Typography variant="h5" className="fw-bold text-success">{confirmedCount}</Typography>
              <Typography variant="body2" className="text-muted">Confirmed Appointments</Typography>
            </Paper>
          </div>
          <div className="col-md-4">
            <Paper className="stat-card stat-card-total fadeInUp" style={{ animationDelay: '0.2s' }}>
              <Typography variant="h5" className="fw-bold text-primary">{appointments.length}</Typography>
              <Typography variant="body2" className="text-muted">Total Appointments</Typography>
            </Paper>
          </div>
        </div>

        {error && <Alert severity="error" className="mb-4" onClose={() => setError('')}>{error}</Alert>}

        <div className="row g-4">
          {/* Availability Management */}
          <div className="col-lg-4">
            <Paper className="availability-card">
              <Box className="d-flex justify-content-between align-items-center mb-4">
                <Typography variant="h6" className="fw-bold">📅 Manage Availability</Typography>
                <Button size="small" variant="contained" onClick={saveAvailability}>Save</Button>
              </Box>
              <Box className="availability-form">
                {availability.map((slot, idx) => (
                  <Box key={`${slot.day}-${idx}`} className="availability-slot fadeInForm" style={{ animationDelay: `${idx * 0.05}s` }}>
                    <TextField fullWidth select size="small" label="Day" value={slot.day} onChange={(e) => setAvailability((prev) => prev.map((s, i) => (i === idx ? { ...s, day: e.target.value } : s)))} sx={{ marginBottom: '10px' }}>
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (<MenuItem key={day} value={day}>{day}</MenuItem>))}
                    </TextField>
                    <div className="row g-2">
                      <div className="col-6"><TextField fullWidth size="small" type="time" value={slot.startTime} label="From" onChange={(e) => setAvailability((prev) => prev.map((s, i) => (i === idx ? { ...s, startTime: e.target.value } : s)))} /></div>
                      <div className="col-6"><TextField fullWidth size="small" type="time" value={slot.endTime} label="To" onChange={(e) => setAvailability((prev) => prev.map((s, i) => (i === idx ? { ...s, endTime: e.target.value } : s)))} /></div>
                    </div>
                  </Box>
                ))}
              </Box>
            </Paper>
          </div>

          {/* Appointments Section */}
          <div className="col-lg-8">
            <Paper className="appointments-card">
              <Tabs value={tabValue} onChange={(e, val) => setTabValue(val)} className="mb-3">
                <Tab label={`Pending (${pendingCount})`} />
                <Tab label={`Confirmed (${confirmedCount})`} />
                <Tab label="All" />
              </Tabs>

              <Box className="appointments-list">
                {appointments
                  .filter((appt) => {
                    if (tabValue === 0) return appt.status === 'pending'
                    if (tabValue === 1) return appt.status === 'confirmed'
                    return true
                  })
                  .map((appt, idx) => (
                    <Paper key={appt._id} className="appointment-item fadeInUp" style={{ animationDelay: `${idx * 0.05}s` }}>
                      <Box className="d-flex justify-content-between align-items-start">
                        <Box className="flex-grow-1">
                          <Typography variant="h6" className="fw-bold">{appt.patient?.name}</Typography>
                          <Typography variant="body2" className="text-muted">📅 {dayjs(appt.appointmentDate).format('DD MMM YYYY')} at {appt.timeSlot}</Typography>
                          {appt.reason && <Typography variant="body2" className="mt-2"><strong>Reason:</strong> {appt.reason}</Typography>}
                        </Box>
                        <Chip label={appt.status} color={getStatusColor(appt.status)} size="small" className="ms-2" />
                      </Box>
                      <Box className="appointment-actions mt-3">
                        {appt.status === 'pending' && (
                          <>
                            <Button size="small" variant="contained" color="success" onClick={() => updateStatus(appt._id, 'confirmed')} className="me-2">✓ Confirm</Button>
                            <Button size="small" variant="outlined" color="error" onClick={() => updateStatus(appt._id, 'rejected')}>✕ Reject</Button>
                          </>
                        )}
                        {appt.status === 'confirmed' && <Button size="small" variant="text" onClick={() => updateStatus(appt._id, 'completed')}>Mark Complete</Button>}
                      </Box>
                    </Paper>
                  ))}
                {appointments.length === 0 && (
                  <Typography variant="body2" className="text-muted text-center py-4">No appointments to show</Typography>
                )}
              </Box>
            </Paper>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboardPage
