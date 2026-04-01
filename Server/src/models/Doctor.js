const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema(
  {
    day: {
      type: String,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

const doctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    specialty: {
      type: String,
      required: true,
      index: true,
    },
    location: {
      type: String,
      required: true,
      index: true,
    },
    experienceYears: {
      type: Number,
      default: 0,
    },
    feePerConsultation: {
      type: Number,
      default: 0,
    },
    licenseNumber: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
    approvalNote: {
      type: String,
      default: '',
    },
    availability: [availabilitySchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Doctor', doctorSchema);
