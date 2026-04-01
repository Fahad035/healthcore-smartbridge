const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      default: 'info',
    },
    message: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    phone: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['patient', 'doctor', 'admin'],
      default: 'patient',
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    medicalProfile: {
      dob: String,
      gender: String,
      bloodGroup: String,
      address: String,
      allergies: [String],
      conditions: [String],
    },
    notifications: [notificationSchema],
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
