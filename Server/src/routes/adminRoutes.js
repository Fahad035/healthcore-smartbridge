const express = require('express');
const {
  getDoctorApplications,
  reviewDoctorApplication,
  getAllUsers,
  toggleUserBlock,
} = require('../controllers/adminController');
const { authMiddleware, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware, authorizeRoles('admin'));
router.get('/doctor-applications', getDoctorApplications);
router.patch('/doctor-applications/:id/review', reviewDoctorApplication);
router.get('/users', getAllUsers);
router.patch('/users/:id/toggle-block', toggleUserBlock);

module.exports = router;
