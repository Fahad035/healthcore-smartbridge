const Doctor = require('../models/Doctor');
const User = require('../models/User');

const getDoctorApplications = async (req, res) => {
  try {
    const { status = 'pending' } = req.query;
    const doctors = await Doctor.find({ status }).populate('user', 'name email phone role createdAt');

    return res.status(200).json({ doctors });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch doctor applications', error: error.message });
  }
};

const reviewDoctorApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, approvalNote } = req.body;

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ message: 'Action must be approve or reject' });
    }

    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor application not found' });
    }

    doctor.status = action === 'approve' ? 'approved' : 'rejected';
    doctor.approvalNote = approvalNote || '';
    await doctor.save();

    const user = await User.findById(doctor.user);
    if (user) {
      user.role = action === 'approve' ? 'doctor' : 'patient';
      user.notifications.push({
        type: 'doctor-application-review',
        message: `Your doctor application has been ${action === 'approve' ? 'approved' : 'rejected'}.`,
        data: { doctorId: doctor._id, status: doctor.status },
      });
      await user.save();
    }

    return res.status(200).json({ message: `Doctor application ${doctor.status}`, doctor });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to review doctor application', error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
};

const toggleUserBlock = async (req, res) => {
  try {
    const { id } = req.params;
    const target = await User.findById(id);
    if (!target) {
      return res.status(404).json({ message: 'User not found' });
    }

    target.isBlocked = !target.isBlocked;
    await target.save();

    return res.status(200).json({ message: `User ${target.isBlocked ? 'blocked' : 'unblocked'}` });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update user state', error: error.message });
  }
};

module.exports = {
  getDoctorApplications,
  reviewDoctorApplication,
  getAllUsers,
  toggleUserBlock,
};
