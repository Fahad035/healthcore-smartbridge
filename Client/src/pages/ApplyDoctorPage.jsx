import { Alert, Button, Card, CardContent, TextField, Typography, Box, Paper, Step, Stepper, StepLabel, Chip } from '@mui/material'
import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import http from '../api/http'

const ApplyDoctorPage = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    fullName: '',
    specialty: '',
    location: '',
    experienceYears: 0,
    feePerConsultation: 0,
    licenseNumber: '',
    bio: '',
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [step, setStep] = useState(0)
  const [touched, setTouched] = useState({})

  const handleChange = useCallback((key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }))
    setTouched((prev) => ({ ...prev, [key]: true }))
  }, [])

  const isStepValid = useCallback(() => {
    if (step === 0) return form.fullName && form.specialty && form.location
    if (step === 1) return form.experienceYears && form.feePerConsultation && form.licenseNumber
    return form.bio
  }, [step, form])

  const handleNext = () => {
    if (isStepValid()) setStep(step + 1)
  }

  const handlePrev = () => setStep(step - 1)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')
    setError('')

    try {
      const { data } = await http.post('/user/apply-doctor', {
        ...form,
        experienceYears: Number(form.experienceYears),
        feePerConsultation: Number(form.feePerConsultation),
      })
      setMessage(data.message)
      setTimeout(() => navigate('/dashboard'), 1200)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit doctor application')
    }
  }

  return (
    <div className="apply-doctor-wrapper">
      <Box className="apply-doctor-header">
        <Typography variant="h4" className="fw-bold">🏥 Apply as Doctor</Typography>
        <Typography variant="body2" className="text-muted">Complete your professional profile</Typography>
      </Box>

      <div className="container py-5">
        <div className="row g-4">
          <div className="col-lg-8">
            <Stepper activeStep={step} className="mb-4">
              <Step>
                <StepLabel><Typography variant="body2">Personal Info</Typography></StepLabel>
              </Step>
              <Step>
                <StepLabel><Typography variant="body2">Professional Details</Typography></StepLabel>
              </Step>
              <Step>
                <StepLabel><Typography variant="body2">Biography</Typography></StepLabel>
              </Step>
            </Stepper>

            <Paper className="apply-form-card">
              {message && <Alert severity="success" className="mb-3" onClose={() => setMessage('')}>{message}</Alert>}
              {error && <Alert severity="error" className="mb-3" onClose={() => setError('')}>{error}</Alert>}

              <form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
                {/* Step 1: Personal Info */}
                {step === 0 && (
                  <Box className="form-step fadeInForm">
                    <Typography variant="h6" className="fw-bold mb-4">📋 Personal Information</Typography>
                    <div className="row g-3">
                      <div className="col-12">
                        <TextField fullWidth label="Full Name" required placeholder="Dr. John Doe" value={form.fullName} onChange={handleChange('fullName')} error={touched.fullName && !form.fullName} className="form-input-modern" />
                      </div>
                      <div className="col-md-6">
                        <TextField fullWidth label="Medical Specialty" required placeholder="Cardiologist" value={form.specialty} onChange={handleChange('specialty')} error={touched.specialty && !form.specialty} className="form-input-modern" />
                      </div>
                      <div className="col-md-6">
                        <TextField fullWidth label="Primary Location" required placeholder="Delhi" value={form.location} onChange={handleChange('location')} error={touched.location && !form.location} className="form-input-modern" />
                      </div>
                    </div>
                  </Box>
                )}

                {/* Step 2: Professional Details */}
                {step === 1 && (
                  <Box className="form-step fadeInForm">
                    <Typography variant="h6" className="fw-bold mb-4">💼 Professional Details</Typography>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <TextField fullWidth label="Experience (Years)" required type="number" placeholder="15" value={form.experienceYears} onChange={handleChange('experienceYears')} error={touched.experienceYears && !form.experienceYears} className="form-input-modern" />
                      </div>
                      <div className="col-md-6">
                        <TextField fullWidth label="Consultation Fee (₹)" required type="number" placeholder="1500" value={form.feePerConsultation} onChange={handleChange('feePerConsultation')} error={touched.feePerConsultation && !form.feePerConsultation} className="form-input-modern" />
                      </div>
                      <div className="col-12">
                        <TextField fullWidth label="Medical License Number" required placeholder="REG1234567" value={form.licenseNumber} onChange={handleChange('licenseNumber')} error={touched.licenseNumber && !form.licenseNumber} className="form-input-modern" />
                      </div>
                    </div>
                  </Box>
                )}

                {/* Step 3: Biography */}
                {step === 2 && (
                  <Box className="form-step fadeInForm">
                    <Typography variant="h6" className="fw-bold mb-4">✍️ Professional Biography</Typography>
                    <TextField fullWidth multiline rows={6} label="About Your Expertise" placeholder="Write about your experience, qualifications, and specializations..." value={form.bio} onChange={handleChange('bio')} className="form-input-modern bio-field" />
                  </Box>
                )}

                {/* Form Actions */}
                <Box className="form-actions mt-4">
                  {step > 0 && (
                    <Button variant="outlined" onClick={handlePrev} className="btn-action">← Previous</Button>
                  )}
                  <Box sx={{ flex: 1 }} />
                  {step < 2 ? (
                    <Button variant="contained" onClick={handleNext} disabled={!isStepValid()} className="btn-action-next">Next →</Button>
                  ) : (
                    <Button variant="contained" type="submit" size="large" className="btn-submit-doctor">✓ Submit Application</Button>
                  )}
                </Box>
              </form>
            </Paper>
          </div>

          {/* Signing Doctor Animation */}
          <div className="col-lg-4">
            <Paper className="doctor-sign-card">
              <Box className="signing-animation">
                <Typography variant="h2" className="doctor-sign-emoji">✍️</Typography>
                <Typography variant="h6" className="fw-bold mt-3">Sign Your Application</Typography>
                <Typography variant="body2" className="text-muted mt-2">Your profile will be reviewed by our admin team</Typography>
              </Box>
            </Paper>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApplyDoctorPage
