const moment = require('moment');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const { sendNotification } = require('../utils/notificationService');

const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorUser: req.user._id })
      .populate('patient', 'name email phone medicalProfile')
      .populate('doctorProfile')
      .sort({ appointmentDate: 1, timeSlot: 1 });

    return res.status(200).json({ appointments });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch doctor appointments', error: error.message });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, visitSummary, followUpNotes, recommendations, cancellationReason } = req.body;

    const allowedStatuses = ['confirmed', 'rejected', 'completed', 'cancelled'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status update' });
    }

    const appointment = await Appointment.findOne({ _id: id, doctorUser: req.user._id });
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (status === 'confirmed') {
      const conflict = await Appointment.findOne({
        _id: { $ne: appointment._id },
        doctorUser: req.user._id,
        appointmentDate: appointment.appointmentDate,
        timeSlot: appointment.timeSlot,
        status: 'confirmed',
      });

      if (conflict) {
        return res.status(409).json({ message: 'Conflicting appointment already confirmed for this slot' });
      }
    }

    appointment.status = status;

    if (status === 'completed') {
      appointment.visitSummary = visitSummary || '';
      appointment.followUpNotes = followUpNotes || '';
      appointment.recommendations = recommendations || '';
    }

    if (status === 'cancelled') {
      appointment.cancellationReason = cancellationReason || '';
    }

    await appointment.save();

    const patient = await User.findById(appointment.patient);
    if (patient) {
      patient.notifications.push({
        type: 'appointment-status',
        message: `Your appointment on ${moment(appointment.appointmentDate).format('DD MMM YYYY')} at ${appointment.timeSlot} is now ${status}.`,
        data: { appointmentId: appointment._id, status },
      });
      await patient.save();

      await sendNotification({
        user: patient,
        subject: 'Appointment Status Updated - Book a Doctor',
        messageHtml: `<p>Your appointment on <strong>${moment(appointment.appointmentDate).format('DD MMM YYYY')}</strong> at <strong>${appointment.timeSlot}</strong> is now <strong>${status}</strong>.</p>`,
        messageText: `Your appointment on ${moment(appointment.appointmentDate).format('DD MMM YYYY')} at ${appointment.timeSlot} is now ${status}.`,
      });
    }

    await sendNotification({
      user: req.user,
      subject: 'Appointment Status Recorded - Book a Doctor',
      messageHtml: `<p>You updated appointment status to <strong>${status}</strong> for <strong>${moment(appointment.appointmentDate).format('DD MMM YYYY')}</strong> at <strong>${appointment.timeSlot}</strong>.</p>`,
      messageText: `You updated appointment status to ${status} for ${moment(appointment.appointmentDate).format('DD MMM YYYY')} at ${appointment.timeSlot}.`,
    });

    return res.status(200).json({ message: 'Appointment status updated', appointment });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update appointment status', error: error.message });
  }
};

const updateAvailability = async (req, res) => {
  try {
    const { availability } = req.body;
    if (!Array.isArray(availability)) {
      return res.status(400).json({ message: 'Availability must be an array' });
    }

    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    doctor.availability = availability;
    await doctor.save();

    return res.status(200).json({ message: 'Availability updated', doctor });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update availability', error: error.message });
  }
};

module.exports = {
  getDoctorAppointments,
  updateAppointmentStatus,
  updateAvailability,
};
