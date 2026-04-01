import { Button, Card, CardContent, Chip, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'

const LandingPage = () => {
  const navigate = useNavigate()
  const [currentTime, setCurrentTime] = useState(dayjs().format('hh:mm:ss A'))

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(dayjs().format('hh:mm:ss A'))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const services = [
    { name: 'Eye Care', icon: '👁️' },
    { name: 'Dental Care', icon: '🦷' },
    { name: 'Cardiology', icon: '❤️' },
    { name: 'Gynecology', icon: '🩺' },
    { name: 'Orthopedic', icon: '🦴' },
    { name: 'Neurology', icon: '🧠' },
  ]

  const doctors = [
    { name: 'Dr Calvin Carlo', role: 'Eye Care', avatar: '👨‍⚕️' },
    { name: 'Dr Alia Reddy', role: 'Psychotherapist', avatar: '👩‍⚕️' },
    { name: 'Dr Toni Kovar', role: 'Orthopedic', avatar: '👨‍⚕️' },
    { name: 'Dr Jennifer Ballance', role: 'Cardiology', avatar: '👩‍⚕️' },
  ]

  const blogs = [
    { date: '13 Sep 2026', title: 'Easily connect to doctor and start treatment' },
    { date: '29 Nov 2026', title: 'How tele-consultation saves emergency response time' },
    { date: '29 Dec 2026', title: 'Medicine research updates every practitioner should know' },
  ]

  return (
    <div className="drl-page">
      <section className="drl-hero">
        <div className="container py-5">
          <div className="row g-4 align-items-center py-4">
            <div className="col-lg-7">
              <Chip label="Best Healthcare Booking Platform" className="drl-chip mb-3" />
              <Typography variant="h2" className="drl-title mb-3">
                Meet The Best Doctors, Book Appointments In Minutes
              </Typography>
              <Typography variant="body1" className="drl-subtitle mb-4">
                Great doctor if you need your family member to get effective immediate assistance, emergency treatment, or simple consultation with confidence.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button variant="contained" size="large" className="drl-btn-primary" onClick={() => navigate('/register')}>
                  Make Appointment
                </Button>
                <Button variant="outlined" size="large" className="drl-btn-outline" onClick={() => navigate('/login')}>
                  View Departments
                </Button>
              </Stack>
            </div>
            <div className="col-lg-5">
              <Card className="drl-appointment-card">
                <CardContent>
                  <Typography variant="h6" className="fw-bold mb-3">Quick Care Access</Typography>
                  <div className="drl-mini-list">
                    <div><span>Emergency Cases</span><span>24/7</span></div>
                    <div><span>Doctors Timetable</span><span>Live</span></div>
                    <div><span>Opening Hours</span><span>8AM-8PM</span></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="row g-3 mt-1">
            <div className="col-md-4">
              <Card className="drl-info-card h-100">
                <CardContent>
                  <Typography variant="h6" className="mb-2">Emergency Cases</Typography>
                  <Typography variant="body2" className="text-muted">Fast response for urgent care needs and immediate booking support.</Typography>
                </CardContent>
              </Card>
            </div>
            <div className="col-md-4">
              <Card className="drl-info-card h-100">
                <CardContent>
                  <Typography variant="h6" className="mb-2">Doctors Timetable</Typography>
                  <Typography variant="body2" className="text-muted">Find real-time slot availability before booking any appointment.</Typography>
                </CardContent>
              </Card>
            </div>
            <div className="col-md-4">
              <Card className="drl-info-card h-100">
                <CardContent>
                  <Typography variant="h6" className="mb-2">Opening Hours</Typography>
                  <Typography variant="body2" className="text-muted">Mon-Fri: 8:00-20:00 | Sat: 8:00-18:00 | Sun: 8:00-14:00</Typography>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="drl-section">
        <div className="container py-5">
          <div className="row g-4 align-items-center">
            <div className="col-lg-6">
              <div className="drl-photo-block">🏥</div>
            </div>
            <div className="col-lg-6">
              <Typography variant="overline" className="drl-label">About Our Treatments</Typography>
              <Typography variant="h4" className="fw-bold mb-3">Trusted Clinical Care Backed By Smart Workflow</Typography>
              <Typography variant="body1" className="text-muted mb-3">
                Great doctor if you need your family member to get effective immediate assistance, examination, emergency treatment or a simple consultation.
              </Typography>
              <Button variant="contained" className="drl-btn-primary" onClick={() => navigate('/register')}>
                Read More
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="drl-section drl-soft">
        <div className="container py-5">
          <Typography variant="overline" className="drl-label">Our Medical Services</Typography>
          <Typography variant="h4" className="fw-bold mb-4">Comprehensive Departments For Every Need</Typography>
          <div className="row g-3">
            {services.map((service) => (
              <div className="col-md-6 col-lg-4" key={service.name}>
                <Card className="drl-service-card h-100">
                  <CardContent>
                    <div className="drl-service-icon">{service.icon}</div>
                    <Typography variant="h6" className="mb-2">{service.name}</Typography>
                    <Typography variant="body2" className="text-muted">There is now an abundance of readable text required purely to fill this space with useful detail.</Typography>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="drl-section">
        <div className="container py-5">
          <Typography variant="overline" className="drl-label">Doctors Time Table</Typography>
          <Typography variant="h4" className="fw-bold mb-4">Weekly Availability Snapshot</Typography>
          <div className="table-responsive drl-table-wrap">
            <table className="table align-middle drl-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Monday</th>
                  <th>Tuesday</th>
                  <th>Wednesday</th>
                  <th>Thursday</th>
                  <th>Friday</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>09:00 AM</td>
                  <td>Eye Care</td>
                  <td>-</td>
                  <td>Psychotherapy</td>
                  <td>Cardiology</td>
                  <td>Orthopedic</td>
                </tr>
                <tr>
                  <td>11:00 AM</td>
                  <td>-</td>
                  <td>Gynecology</td>
                  <td>-</td>
                  <td>Cardiology</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>02:00 PM</td>
                  <td>Neurology</td>
                  <td>-</td>
                  <td>Orthopedic</td>
                  <td>-</td>
                  <td>Psychotherapy</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="drl-section drl-soft">
        <div className="container py-5">
          <Typography variant="overline" className="drl-label">Doctors</Typography>
          <Typography variant="h4" className="fw-bold mb-4">Meet Our Experienced Specialists</Typography>
          <div className="row g-3">
            {doctors.map((doc) => (
              <div className="col-sm-6 col-lg-3" key={doc.name}>
                <Card className="drl-doctor-card h-100">
                  <CardContent>
                    <div className="drl-doctor-avatar">{doc.avatar}</div>
                    <Typography variant="h6" className="mt-2 mb-1">{doc.name}</Typography>
                    <Typography variant="body2" className="text-muted">{doc.role}</Typography>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="drl-metrics">
        <div className="container py-4">
          <div className="row text-center g-3">
            <div className="col-md-4"><h3>99%</h3><p>Positive Feedback</p></div>
            <div className="col-md-4"><h3>25+</h3><p>Experienced Clinics</p></div>
            <div className="col-md-4"><h3>1,251+</h3><p>Questions & Answers</p></div>
          </div>
        </div>
      </section>

      <section className="drl-section">
        <div className="container py-5">
          <Typography variant="overline" className="drl-label">Patients Says</Typography>
          <Typography variant="h4" className="fw-bold mb-4">What Patients Say About Us</Typography>
          <Card className="drl-testimonial">
            <CardContent>
              <Typography variant="body1" className="mb-3">
                The booking flow is very smooth and doctors are responsive. I found the exact specialist in less than five minutes.
              </Typography>
              <Typography variant="subtitle2" className="fw-bold">- Carl Oliver P.A</Typography>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="drl-section drl-soft">
        <div className="container py-5">
          <Typography variant="overline" className="drl-label">Latest News & Blogs</Typography>
          <Typography variant="h4" className="fw-bold mb-4">Insights For Better Health Decisions</Typography>
          <div className="row g-3">
            {blogs.map((blog) => (
              <div className="col-md-4" key={blog.title}>
                <Card className="drl-blog-card h-100">
                  <CardContent>
                    <Typography variant="caption" className="text-muted">{blog.date} • 5 min read</Typography>
                    <Typography variant="h6" className="mt-2 mb-2">{blog.title}</Typography>
                    <Typography variant="body2" className="text-muted">Read more health stories and expert advice from our care network.</Typography>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="drl-footer">
        <div className="container py-5">
          <div className="row g-4">
            <div className="col-md-4">
              <Typography variant="h6" className="mb-3">Company</Typography>
              <ul className="drl-footer-list">
                <li>About us</li>
                <li>Services</li>
                <li>Team</li>
                <li>Blog</li>
              </ul>
            </div>
            <div className="col-md-4">
              <Typography variant="h6" className="mb-3">Departments</Typography>
              <ul className="drl-footer-list">
                <li>Eye Care</li>
                <li>Dental Care</li>
                <li>Cardiology</li>
                <li>Neurology</li>
              </ul>
            </div>
            <div className="col-md-4">
              <Typography variant="h6" className="mb-3">Contact</Typography>
              <Typography variant="body2" className="mb-1">contact@smartbridge.health</Typography>
              <Typography variant="body2" className="mb-1">+91 7995251073</Typography>
              <Typography variant="body2">Hyderabad, India • {currentTime}</Typography>
            </div>
          </div>
          <div className="drl-footer-bottom mt-4 pt-3">
            <Typography variant="caption">© 2026 HealthCore. Design inspired by modern healthcare landing pages.</Typography>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
