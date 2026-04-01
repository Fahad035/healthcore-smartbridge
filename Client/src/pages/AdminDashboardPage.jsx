import { Alert, Button, Card, CardContent, Chip, Typography, Box, Paper, Tab, Tabs, Badge, LinearProgress } from '@mui/material'
import { useEffect, useState } from 'react'
import http from '../api/http'

const AdminDashboardPage = () => {
  const [applications, setApplications] = useState([])
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')
  const [tabValue, setTabValue] = useState(0)

  const pendingApps = applications.filter(a => a.status === 'pending')
  const approvedDoctors = applications.filter(a => a.status === 'approved')
  const blockedUsers = users.filter(u => u.isBlocked)

  const loadData = async () => {
    try {
      const [applicationsRes, usersRes] = await Promise.all([
        http.get('/admin/doctor-applications', { params: { status: 'pending' } }),
        http.get('/admin/users'),
      ])

      setApplications(applicationsRes.data.doctors || [])
      setUsers(usersRes.data.users || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load admin dashboard')
    }
  }

  useEffect(() => {
    const timerId = setTimeout(() => {
      loadData()
    }, 0)

    return () => clearTimeout(timerId)
  }, [])

  const review = async (id, action) => {
    try {
      await http.patch(`/admin/doctor-applications/${id}/review`, { action })
      await loadData()
    } catch (err) {
      setError(err.response?.data?.message || 'Review action failed')
    }
  }

  const toggleBlock = async (id) => {
    try {
      await http.patch(`/admin/users/${id}/toggle-block`)
      await loadData()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user')
    }
  }

  return (
    <div className="admin-dashboard-wrapper">
      <Box className="admin-dashboard-header">
        <Typography variant="h4" className="fw-bold">⚙️ Admin Control Center</Typography>
        <Typography variant="body2" className="text-muted">Manage doctor applications and users</Typography>
      </Box>

      <div className="container py-5">
        {/* Stats Cards */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <Paper className="stat-card stat-card-pending fadeInUp">
              <Typography variant="h5" className="fw-bold text-warning">{pendingApps.length}</Typography>
              <Typography variant="body2" className="text-muted">Pending Approvals</Typography>
              <LinearProgress variant="determinate" value={(pendingApps.length / Math.max(applications.length, 1)) * 100} className="mt-2" />
            </Paper>
          </div>
          <div className="col-md-4">
            <Paper className="stat-card stat-card-confirmed fadeInUp" style={{ animationDelay: '0.1s' }}>
              <Typography variant="h5" className="fw-bold text-success">{approvedDoctors.length}</Typography>
              <Typography variant="body2" className="text-muted">Approved Doctors</Typography>
              <LinearProgress variant="determinate" value={(approvedDoctors.length / Math.max(applications.length, 1)) * 100} className="mt-2" />
            </Paper>
          </div>
          <div className="col-md-4">
            <Paper className="stat-card stat-card-users fadeInUp" style={{ animationDelay: '0.2s' }}>
              <Typography variant="h5" className="fw-bold text-info">{users.length}</Typography>
              <Typography variant="body2" className="text-muted">Total Users</Typography>
              <LinearProgress variant="determinate" value={((users.length - blockedUsers.length) / Math.max(users.length, 1)) * 100} className="mt-2" />
            </Paper>
          </div>
        </div>

        {error && <Alert severity="error" className="mb-4" onClose={() => setError('')}>{error}</Alert>}

        {/* Tabbed Content */}
        <Paper className="admin-tabs-card">
          <Tabs value={tabValue} onChange={(e, val) => setTabValue(val)} className="mb-3">
            <Tab label={<Badge badgeContent={pendingApps.length} color="error"><span>Doctor Applications</span></Badge>} />
            <Tab label={<Badge badgeContent={users.length} color="primary"><span>Users Management</span></Badge>} />
          </Tabs>

          {/* Doctor Applications */}
          {tabValue === 0 && (
            <Box className="applications-section">
              {pendingApps.length > 0 ? (
                <div className="applications-grid">
                  {pendingApps.map((doc, idx) => (
                    <Paper key={doc._id} className="app-card fadeInUp" style={{ animationDelay: `${idx * 0.05}s` }}>
                      <Box className="app-card-header">
                        <Box>
                          <Typography variant="h6" className="fw-bold">👨‍⚕️ {doc.fullName}</Typography>
                          <Chip label={doc.specialty} size="small" className="mt-2" />
                        </Box>
                        <Chip label="PENDING" color="warning" />
                      </Box>

                      <Box className="app-card-details mt-3">
                        <Typography variant="body2"><strong>📍 Location:</strong> {doc.location}</Typography>
                        <Typography variant="body2"><strong>⏱️ Experience:</strong> {doc.experienceYears} years</Typography>
                        <Typography variant="body2"><strong>💰 Fee:</strong> ₹{doc.feePerConsultation}</Typography>
                        <Typography variant="body2"><strong>📜 License:</strong> {doc.licenseNumber}</Typography>
                        {doc.bio && <Typography variant="body2" className="mt-2"><strong>Bio:</strong> {doc.bio.substring(0, 80)}...</Typography>}
                      </Box>

                      <Box className="app-card-actions mt-3 pt-3">
                        <Button size="small" variant="contained" color="success" onClick={() => review(doc._id, 'approve')} fullWidth className="mb-2">✓ Approve</Button>
                        <Button size="small" variant="outlined" color="error" onClick={() => review(doc._id, 'reject')} fullWidth>✕ Reject</Button>
                      </Box>
                    </Paper>
                  ))}
                </div>
              ) : (
                <Typography variant="body2" className="text-muted text-center py-5">✓ No pending applications!</Typography>
              )}
            </Box>
          )}

          {/* Users Management */}
          {tabValue === 1 && (
            <Box className="users-section">
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th>👤 Name</th>
                      <th>📧 Email</th>
                      <th>🏷️ Role</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, idx) => (
                      <tr key={user._id} className="fadeInUp" style={{ animationDelay: `${idx * 0.05}s` }}>
                        <td><Typography variant="body2" className="fw-bold">{user.name}</Typography></td>
                        <td><Typography variant="body2">{user.email}</Typography></td>
                        <td>
                          <Chip label={user.role.toUpperCase()} size="small" color={user.role === 'admin' ? 'error' : user.role === 'doctor' ? 'success' : 'default'} />
                        </td>
                        <td>
                          <Chip label={user.isBlocked ? 'BLOCKED' : 'ACTIVE'} color={user.isBlocked ? 'error' : 'success'} size="small" />
                        </td>
                        <td>
                          <Button size="small" variant={user.isBlocked ? 'contained' : 'outlined'} color={user.isBlocked ? 'success' : 'error'} onClick={() => toggleBlock(user._id)}>
                            {user.isBlocked ? '🔓 Unblock' : '🔒 Block'}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Box>
          )}
        </Paper>
      </div>
    </div>
  )
}

export default AdminDashboardPage
