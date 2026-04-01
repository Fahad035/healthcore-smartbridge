import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Rating,
  TextField,
  Typography,
} from '@mui/material'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import http from '../api/http'
import { useAuth } from '../context/AuthContext'

// Featured doctors sample data for India
const FEATURED_DOCTORS = [
  {
    id: 'feat-1',
    name: 'Dr. Rajesh Kumar',
    specialty: 'Cardiologist',
    location: 'Hyderabad',
    experience: 18,
    phone: '+91-9876543210',
    address: 'Apollo Hospitals, Jubilee Hills, Hyderabad',
    fee: 1500,
    rating: 4.9,
    reviews: 324,
    website: 'https://www.practo.com/search?results_type=doctor&q=Dr%20Rajesh%20Kumar%20Hyderabad',
    image: '👨‍⚕️',
  },
  {
    id: 'feat-2',
    name: 'Dr. Priya Sharma',
    specialty: 'Gynecologist',
    location: 'Mumbai',
    experience: 16,
    phone: '+91-9876543211',
    address: 'Max Healthcare, Bandra, Mumbai',
    fee: 1200,
    rating: 4.8,
    reviews: 289,
    website: 'https://www.practo.com/search?results_type=doctor&q=Dr%20Priya%20Sharma%20Mumbai',
    image: '👩‍⚕️',
  },
  {
    id: 'feat-3',
    name: 'Dr. Amit Verma',
    specialty: 'Orthopedic Surgeon',
    location: 'Delhi',
    experience: 20,
    phone: '+91-9876543212',
    address: 'Fortis Hospital, Vasant Kunj, Delhi',
    fee: 1800,
    rating: 4.7,
    reviews: 412,
    website: 'https://www.practo.com/search?results_type=doctor&q=Dr%20Amit%20Verma%20Delhi',
    image: '👨‍⚕️',
  },
  {
    id: 'feat-4',
    name: 'Dr. Sneha Patel',
    specialty: 'Dermatologist',
    location: 'Bangalore',
    experience: 14,
    phone: '+91-9876543213',
    address: 'Manipal Hospital, Indiranagar, Bangalore',
    fee: 1000,
    rating: 4.9,
    reviews: 198,
    website: 'https://www.practo.com/search?results_type=doctor&q=Dr%20Sneha%20Patel%20Bangalore',
    image: '👩‍⚕️',
  },
  {
    id: 'feat-5',
    name: 'Dr. Vikram Singh',
    specialty: 'Pulmonologist',
    location: 'Pune',
    experience: 17,
    phone: '+91-9876543214',
    address: 'Ruby Hall Clinic, Pune',
    fee: 1100,
    rating: 4.8,
    reviews: 267,
    website: 'https://www.practo.com/search?results_type=doctor&q=Dr%20Vikram%20Singh%20Pune',
    image: '👨‍⚕️',
  },
  {
    id: 'feat-6',
    name: 'Dr. Anjali Desai',
    specialty: 'Pediatrician',
    location: 'Ahmedabad',
    experience: 13,
    phone: '+91-9876543215',
    address: 'Sterling Hospital, Ahmedabad',
    fee: 900,
    rating: 4.9,
    reviews: 156,
    website: 'https://www.practo.com/search?results_type=doctor&q=Dr%20Anjali%20Desai%20Ahmedabad',
    image: '👩‍⚕️',
  },
]

const DashboardPage = () => {
  const { user } = useAuth()
  const [filters, setFilters] = useState({ specialty: '', location: '', date: '' })
  const [doctors, setDoctors] = useState([])
  const [appointments, setAppointments] = useState([])
  const [notifications, setNotifications] = useState([])
  const [error, setError] = useState('')
  const [bookOpen, setBookOpen] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [bookingForm, setBookingForm] = useState({ appointmentDate: '', timeSlot: '', reason: '', document: null })

  const timeSlots = useMemo(
    () => [
      '09:00 AM - 09:30 AM',
      '09:30 AM - 10:00 AM',
      '10:00 AM - 10:30 AM',
      '10:30 AM - 11:00 AM',
      '02:00 PM - 02:30 PM',
      '02:30 PM - 03:00 PM',
      '03:00 PM - 03:30 PM',
      '03:30 PM - 04:00 PM',
    ],
    [],
  )

  const loadDashboard = useCallback(async () => {
    try {
      const [doctorsRes, appointmentsRes, notificationsRes] = await Promise.all([
        http.get('/user/doctors', { params: filters }),
        http.get('/user/appointments'),
        http.get('/user/notifications'),
      ])

      setDoctors(doctorsRes.data.doctors || [])
      setAppointments(appointmentsRes.data.appointments || [])
      setNotifications(notificationsRes.data.notifications || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data')
    }
  }, [filters])

  useEffect(() => {
    let timerId
    if (user?.role === 'patient') {
      timerId = setTimeout(() => {
        loadDashboard()
      }, 0)
    }
    return () => {
      if (timerId) {
        clearTimeout(timerId)
      }
    }
  }, [user?.role, loadDashboard])

  const handleFilterChange = (key) => (event) => {
    setFilters((prev) => ({ ...prev, [key]: event.target.value }))
  }

  const handleSearch = async () => {
    try {
      const { data } = await http.get('/user/doctors', { params: filters })
      setDoctors(data.doctors || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to search doctors')
    }
  }

  const openBookingModal = (doctor) => {
    setSelectedDoctor(doctor)
    setBookOpen(true)
  }

  const submitBooking = async () => {
    if (!selectedDoctor) {
      return
    }

    try {
      const formData = new FormData()
      formData.append('doctorId', selectedDoctor._id)
      formData.append('appointmentDate', bookingForm.appointmentDate)
      formData.append('timeSlot', bookingForm.timeSlot)
      formData.append('reason', bookingForm.reason)
      if (bookingForm.document) {
        formData.append('document', bookingForm.document)
      }

      await http.post('/user/appointments', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      setBookOpen(false)
      setBookingForm({ appointmentDate: '', timeSlot: '', reason: '', document: null })
      await loadDashboard()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment')
    }
  }

  const markRead = async (id) => {
    try {
      await http.patch(`/user/notifications/${id}/read`)
      await loadDashboard()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update notification')
    }
  }

  if (user?.role === 'doctor') {
    return (
      <div className="container py-4">
        <Alert severity="info">
          You are logged in as Doctor. Go to <Link to="/doctor">Doctor Dashboard</Link>.
        </Alert>
      </div>
    )
  }

  if (user?.role === 'admin') {
    return (
      <div className="container py-4">
        <Alert severity="info">
          You are logged in as Admin. Go to <Link to="/admin">Admin Dashboard</Link>.
        </Alert>
      </div>
    )
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between flex-wrap gap-2 align-items-center mb-3">
        <Typography variant="h5" className="fw-bold">User Dashboard</Typography>
        <Button component={Link} to="/apply-doctor" variant="outlined">Apply as Doctor</Button>
      </div>

      {error && <Alert severity="error" className="mb-3">{error}</Alert>}

      {/* Featured Doctors Section */}
      <Box className="mb-5">
        <Box className="d-flex align-items-center gap-2 mb-4">
          <Typography variant="h5" className="fw-bold">⭐ Featured Top Doctors in India</Typography>
          <Chip label="Best Rated" color="success" size="small" />
        </Box>
        <div className="row g-4">
          {FEATURED_DOCTORS.map((doc) => (
            <div className="col-lg-6 col-xl-4" key={doc.id}>
              <Card className="doctor-card doctor-card-featured h-100">
                <CardContent className="d-flex flex-column h-100">
                  <div className="doctor-header mb-3">
                    <span className="doctor-avatar">{doc.image}</span>
                    <div className="doctor-header-info flex-grow-1">
                      <Typography variant="h6" className="doctor-name">{doc.name}</Typography>
                      <Typography variant="caption" className="doctor-specialty-badge">{doc.specialty}</Typography>
                    </div>
                  </div>

                  <div className="doctor-rating mb-2">
                    <Box className="d-flex align-items-center gap-1">
                      <Rating value={doc.rating} readOnly size="small" />
                      <Typography variant="caption" className="text-muted">({doc.reviews})</Typography>
                    </Box>
                  </div>

                  <div className="doctor-details mb-3">
                    <div className="detail-row">
                      <span className="detail-icon">📍</span>
                      <div>
                        <Typography variant="caption" className="d-block text-muted">Location</Typography>
                        <Typography variant="body2" className="fw-500">{doc.location}</Typography>
                      </div>
                    </div>
                    <div className="detail-row">
                      <span className="detail-icon">📱</span>
                      <div>
                        <Typography variant="caption" className="d-block text-muted">Phone</Typography>
                        <Typography variant="body2" className="fw-500">{doc.phone}</Typography>
                      </div>
                    </div>
                    <div className="detail-row">
                      <span className="detail-icon">🏥</span>
                      <div>
                        <Typography variant="caption" className="d-block text-muted">Address</Typography>
                        <Typography variant="body2" className="fw-500">{doc.address}</Typography>
                      </div>
                    </div>
                    <div className="detail-row">
                      <span className="detail-icon">⏱️</span>
                      <div>
                        <Typography variant="caption" className="d-block text-muted">Experience</Typography>
                        <Typography variant="body2" className="fw-500">{doc.experience} years</Typography>
                      </div>
                    </div>
                    <div className="detail-row">
                      <span className="detail-icon">🌐</span>
                      <div>
                        <Typography variant="caption" className="d-block text-muted">Website</Typography>
                        <Typography
                          variant="body2"
                          component="a"
                          href={doc.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="fw-500"
                        >
                          Visit Website
                        </Typography>
                      </div>
                    </div>
                  </div>

                  <div className="doctor-footer mt-auto">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <Typography variant="h6" className="fee-badge">₹{doc.fee}</Typography>
                      <Chip label="Verified" size="small" color="success" variant="outlined" />
                    </div>
                    <div className="d-grid gap-2">
                      <Button variant="contained" fullWidth className="book-btn">
                        Book Appointment
                      </Button>
                      <Button
                        variant="outlined"
                        fullWidth
                        component="a"
                        href={doc.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open Doctor Website
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </Box>

      {/* Search Section */}
      <Card className="search-card mb-4">
        <CardContent>
          <Typography variant="h6" className="mb-3">🔍 Find More Doctors</Typography>
          <div className="row g-2">
            <div className="col-md-4"><TextField fullWidth label="Specialty" placeholder="e.g., Cardiologist" value={filters.specialty} onChange={handleFilterChange('specialty')} />
            </div>
            <div className="col-md-4"><TextField fullWidth label="Location" placeholder="e.g., Hyderabad" value={filters.location} onChange={handleFilterChange('location')} /></div>
            <div className="col-md-3"><TextField fullWidth type="date" label="Date" InputLabelProps={{ shrink: true }} value={filters.date} onChange={handleFilterChange('date')} /></div>
            <div className="col-md-1 d-grid"><Button variant="contained" onClick={handleSearch}>Go</Button></div>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {doctors && doctors.length > 0 && (
        <Box className="mb-4">
          <Typography variant="h6" className="mb-3">Search Results ({doctors.length})</Typography>
          <div className="row g-3">
            {doctors.map((doctor) => (
              <div className="col-md-6" key={doctor._id}>
                <Card className="doctor-card h-100">
                  <CardContent>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <Typography variant="h6" className="mb-1">{doctor.fullName}</Typography>
                        <Typography variant="body2" className="text-success fw-500">{doctor.specialty}</Typography>
                      </div>
                      <Chip label={doctor.hasAvailability ? '✓ Available' : 'Limited'} color={doctor.hasAvailability ? 'success' : 'warning'} size="small" />
                    </div>
                    <Typography variant="body2" className="text-muted mb-2">📍 {doctor.location}</Typography>
                    <Typography variant="body2" className="text-muted mb-3">💰 ₹{doctor.feePerConsultation || 0}</Typography>
                    <Button variant="contained" fullWidth onClick={() => openBookingModal(doctor)}>
                      Book Now
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </Box>
      )}


      <Card className="mb-4">
        <CardContent>
          <Typography variant="h6" className="mb-3">Appointment History</Typography>
          <div className="table-responsive">
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Doctor</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => (
                  <tr key={appt._id}>
                    <td>{dayjs(appt.appointmentDate).format('DD MMM YYYY')}</td>
                    <td>{appt.timeSlot}</td>
                    <td>{appt.doctorProfile?.fullName || 'N/A'}</td>
                    <td><Chip size="small" label={appt.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" className="mb-3">Notifications</Typography>
          {(notifications || []).map((notice) => (
            <div key={notice._id} className="notice-row">
              <div>
                <Typography variant="body2">{notice.message}</Typography>
                <Typography variant="caption" className="text-muted">{dayjs(notice.createdAt).format('DD MMM YYYY hh:mm A')}</Typography>
              </div>
              {!notice.read && (
                <Button size="small" onClick={() => markRead(notice._id)}>
                  Mark read
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={bookOpen} onClose={() => setBookOpen(false)} fullWidth>
        <DialogTitle>Book Appointment with {selectedDoctor?.fullName}</DialogTitle>
        <DialogContent className="d-grid gap-3 pt-2">
          <TextField type="date" label="Appointment Date" InputLabelProps={{ shrink: true }} value={bookingForm.appointmentDate} onChange={(e) => setBookingForm((prev) => ({ ...prev, appointmentDate: e.target.value }))} />
          <TextField select label="Time Slot" value={bookingForm.timeSlot} onChange={(e) => setBookingForm((prev) => ({ ...prev, timeSlot: e.target.value }))}>
            {timeSlots.map((slot) => (
              <MenuItem key={slot} value={slot}>{slot}</MenuItem>
            ))}
          </TextField>
          <TextField multiline rows={3} label="Reason" value={bookingForm.reason} onChange={(e) => setBookingForm((prev) => ({ ...prev, reason: e.target.value }))} />
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setBookingForm((prev) => ({ ...prev, document: e.target.files?.[0] || null }))} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBookOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={submitBooking}>Submit Request</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default DashboardPage
