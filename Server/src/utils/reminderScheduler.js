const cron = require('node-cron');
const moment = require('moment');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const { sendNotification } = require('./notificationService');

const parseSlotStart = (appointmentDate, timeSlot) => {
  const startLabel = String(timeSlot || '').split('-')[0].trim();
  const datePart = moment(appointmentDate).format('YYYY-MM-DD');
  const startMoment = moment(`${datePart} ${startLabel}`, 'YYYY-MM-DD hh:mm A', true);
  return startMoment.isValid() ? startMoment : null;
};

const runReminderJob = async () => {
  const upcoming = await Appointment.find({
    status: 'confirmed',
    reminderSentAt: null,
    appointmentDate: {
      $gte: moment().subtract(1, 'day').startOf('day').toDate(),
    },
  }).populate('patient', 'name email phone');

  for (const appointment of upcoming) {
    const startMoment = parseSlotStart(appointment.appointmentDate, appointment.timeSlot);
    if (!startMoment) {
      continue;
    }

    const now = moment();
    const minutesUntil = startMoment.diff(now, 'minutes');

    if (minutesUntil > 120 || minutesUntil < 0) {
      continue;
    }

    await sendNotification({
      user: appointment.patient,
      subject: 'Appointment Reminder - Book a Doctor',
      messageHtml: `<p>Hi ${appointment.patient?.name || 'Patient'}, your appointment is scheduled for <strong>${startMoment.format('DD MMM YYYY hh:mm A')}</strong>.</p>`,
      messageText: `Hi ${appointment.patient?.name || 'Patient'}, reminder: your appointment is on ${startMoment.format('DD MMM YYYY hh:mm A')}.`,
    });

    appointment.reminderSentAt = new Date();
    await appointment.save();
  }
};

const startReminderScheduler = () => {
  cron.schedule('*/5 * * * *', async () => {
    try {
      await runReminderJob();
    } catch (error) {
      console.error('Reminder scheduler failed:', error.message);
    }
  });

  console.log('Reminder scheduler started (every 5 minutes).');
};

module.exports = {
  startReminderScheduler,
};
