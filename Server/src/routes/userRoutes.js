const express = require('express');
const {
  applyAsDoctor,
  getApprovedDoctors,
  bookAppointment,
  getMyAppointments,
  getNotifications,
  markNotificationRead,
} = require('../controllers/userController');
const { authMiddleware, authorizeRoles } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

router.get('/doctors', authMiddleware, getApprovedDoctors);
router.post('/apply-doctor', authMiddleware, authorizeRoles('patient'), applyAsDoctor);
router.post('/appointments', authMiddleware, authorizeRoles('patient'), upload.single('document'), bookAppointment);
router.get('/appointments', authMiddleware, getMyAppointments);
router.get('/notifications', authMiddleware, getNotifications);
router.patch('/notifications/:id/read', authMiddleware, markNotificationRead);

module.exports = router;
