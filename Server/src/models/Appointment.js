const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    doctorProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
      index: true,
    },
    doctorUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
      index: true,
    },
    timeSlot: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      default: '',
    },
    documentUrl: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'rejected', 'completed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    cancellationReason: {
      type: String,
      default: '',
    },
    visitSummary: {
      type: String,
      default: '',
    },
    followUpNotes: {
      type: String,
      default: '',
    },
    recommendations: {
      type: String,
      default: '',
    },
    reminderSentAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
