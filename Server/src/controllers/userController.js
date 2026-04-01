const moment = require('moment');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const { sendNotification } = require('../utils/notificationService');

const applyAsDoctor = async (req, res) => {
  try {
    const { fullName, specialty, location, experienceYears, feePerConsultation, licenseNumber, bio, availability } = req.body;

    if (!fullName || !specialty || !location || !licenseNumber) {
      return res.status(400).json({ message: 'Missing required doctor application fields' });
    }

    const existingApplication = await Doctor.findOne({ user: req.user._id });
    if (existingApplication) {
      return res.status(409).json({ message: 'Doctor application already exists for this user' });
    }

    const doctor = await Doctor.create({
      user: req.user._id,
      fullName,
      specialty,
      location,
      experienceYears,
      feePerConsultation,
      licenseNumber,
      bio,
      availability: Array.isArray(availability) ? availability : [],
      status: 'pending',
    });

    const admins = await User.find({ role: 'admin' });
    await Promise.all(
      admins.map((admin) => {
        admin.notifications.push({
          type: 'doctor-application',
          message: `New doctor application submitted by ${req.user.name}`,
          data: { doctorId: doctor._id, userId: req.user._id },
        });
        return admin.save();
      })
    );

    return res.status(201).json({ message: 'Doctor application submitted for admin approval', doctor });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to apply as doctor', error: error.message });
  }
};

const getApprovedDoctors = async (req, res) => {
  try {
    const { specialty, location, date } = req.query;
    const filter = { status: 'approved' };

    if (specialty) {
      filter.specialty = new RegExp(specialty, 'i');
    }

    if (location) {
      filter.location = new RegExp(location, 'i');
    }

    const doctors = await Doctor.find(filter).populate('user', 'name email phone');

    const normalizedDate = date ? moment(date).format('YYYY-MM-DD') : null;

    const withAvailability = await Promise.all(
      doctors.map(async (doctor) => {
        if (!normalizedDate) {
          return { ...doctor.toObject(), hasAvailability: true };
        }

        const bookedCount = await Appointment.countDocuments({
          doctorProfile: doctor._id,
          appointmentDate: {
            $gte: moment(normalizedDate).startOf('day').toDate(),
            $lte: moment(normalizedDate).endOf('day').toDate(),
          },
          status: { $in: ['pending', 'confirmed'] },
        });

        return { ...doctor.toObject(), hasAvailability: bookedCount < 12 };
      })
    );

    return res.status(200).json({ doctors: withAvailability });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch doctors', error: error.message });
  }
};

const bookAppointment = async (req, res) => {
  try {
    const { doctorId, appointmentDate, timeSlot, reason } = req.body;

    if (!doctorId || !appointmentDate || !timeSlot) {
      return res.status(400).json({ message: 'doctorId, appointmentDate and timeSlot are required' });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor || doctor.status !== 'approved') {
      return res.status(404).json({ message: 'Doctor not found or not approved' });
    }

    const normalizedDate = moment(appointmentDate).startOf('day').toDate();

    const conflict = await Appointment.findOne({
      doctorProfile: doctor._id,
      appointmentDate: normalizedDate,
      timeSlot,
      status: { $in: ['pending', 'confirmed'] },
    });

    if (conflict) {
      return res.status(409).json({ message: 'Selected slot is already booked' });
    }

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctorProfile: doctor._id,
      doctorUser: doctor.user,
      appointmentDate: normalizedDate,
      timeSlot,
      reason,
      documentUrl: req.file ? `/uploads/${req.file.filename}` : '',
      status: 'pending',
    });

    const doctorUser = await User.findById(doctor.user);
    if (doctorUser) {
      doctorUser.notifications.push({
        type: 'appointment-request',
        message: `New appointment request from ${req.user.name} on ${moment(normalizedDate).format('DD MMM YYYY')} at ${timeSlot}`,
        data: { appointmentId: appointment._id },
      });
      await doctorUser.save();

      await sendNotification({
        user: doctorUser,
        subject: 'New Appointment Request - Book a Doctor',
        messageHtml: `<p>You have a new appointment request from <strong>${req.user.name}</strong> for <strong>${moment(normalizedDate).format('DD MMM YYYY')}</strong> at <strong>${timeSlot}</strong>.</p>`,
        messageText: `New appointment request from ${req.user.name} on ${moment(normalizedDate).format('DD MMM YYYY')} at ${timeSlot}.`,
      });
    }

    await sendNotification({
      user: req.user,
      subject: 'Appointment Request Submitted - Book a Doctor',
      messageHtml: `<p>Your appointment request has been submitted for <strong>${moment(normalizedDate).format('DD MMM YYYY')}</strong> at <strong>${timeSlot}</strong>. You will receive confirmation after doctor review.</p>`,
      messageText: `Your appointment request has been submitted for ${moment(normalizedDate).format('DD MMM YYYY')} at ${timeSlot}.`,
    });

    return res.status(201).json({ message: 'Appointment request submitted', appointment });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to book appointment', error: error.message });
  }
};

const getMyAppointments = async (req, res) => {
  try {
    const query = req.user.role === 'doctor' ? { doctorUser: req.user._id } : { patient: req.user._id };

    const appointments = await Appointment.find(query)
      .populate('patient', 'name email phone')
      .populate({ path: 'doctorProfile', populate: { path: 'user', select: 'name email phone' } })
      .sort({ appointmentDate: -1, createdAt: -1 });

    return res.status(200).json({ appointments });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch appointments', error: error.message });
  }
};

const getNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('notifications');
    return res.status(200).json({ notifications: user?.notifications || [] });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch notifications', error: error.message });
  }
};

const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(req.user._id);
    const target = user.notifications.id(id);
    if (!target) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    target.read = true;
    await user.save();

    return res.status(200).json({ message: 'Notification marked as read' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update notification', error: error.message });
  }
};

module.exports = {
  applyAsDoctor,
  getApprovedDoctors,
  bookAppointment,
  getMyAppointments,
  getNotifications,
  markNotificationRead,
};
