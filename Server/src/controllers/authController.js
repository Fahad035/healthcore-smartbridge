const User = require('../models/User');
const Doctor = require('../models/Doctor');
const { generateToken } = require('../utils/token');

const register = async (req, res) => {
  try {
    const { name, email, password, phone, role, adminInviteCode, medicalProfile } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: 'Email is already registered' });
    }

    let safeRole = 'patient';
    if (role === 'admin') {
      if (!process.env.ADMIN_INVITE_CODE || adminInviteCode !== process.env.ADMIN_INVITE_CODE) {
        return res.status(403).json({ message: 'Invalid admin invite code' });
      }
      safeRole = 'admin';
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: safeRole,
      medicalProfile,
    });

    const token = generateToken({ id: user._id, role: user.role });

    return res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: 'Account is blocked by admin' });
    }

    const validPassword = await user.comparePassword(password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken({ id: user._id, role: user.role });

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const doctorProfile = await Doctor.findOne({ user: req.user._id });
    return res.status(200).json({
      user: req.user,
      doctorProfile,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to get profile', error: error.message });
  }
};

module.exports = {
  register,
  login,
  getMe,
};
