const express = require('express');
const {
  getDoctorAppointments,
  updateAppointmentStatus,
  updateAvailability,
} = require('../controllers/doctorController');
const { authMiddleware, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/appointments', authMiddleware, authorizeRoles('doctor'), getDoctorAppointments);
router.patch('/appointments/:id/status', authMiddleware, authorizeRoles('doctor'), updateAppointmentStatus);
router.put('/availability', authMiddleware, authorizeRoles('doctor'), updateAvailability);

module.exports = router;
