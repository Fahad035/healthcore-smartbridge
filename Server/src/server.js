const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const dotenv = require('dotenv');

const connectDb = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { startReminderScheduler } = require('./utils/reminderScheduler');

dotenv.config();
connectDb();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    message: 'Book a Doctor API is running',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/doctor', doctorRoutes);
app.use('/api/v1/admin', adminRoutes);

app.use((err, req, res, next) => {
  if (err && err.message.includes('Only PDF')) {
    return res.status(400).json({ message: err.message });
  }

  return res.status(500).json({ message: 'Internal server error', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startReminderScheduler();
});
