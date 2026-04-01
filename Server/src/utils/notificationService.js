const nodemailer = require('nodemailer');
const twilio = require('twilio');

const isTruthy = (value) => String(value || '').toLowerCase() === 'true';

let mailTransporter;
if (isTruthy(process.env.EMAIL_ENABLED)) {
  mailTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: isTruthy(process.env.SMTP_SECURE),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

let smsClient;
if (isTruthy(process.env.SMS_ENABLED) && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  smsClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

const sendEmail = async ({ to, subject, html, text }) => {
  if (!mailTransporter || !to) {
    return { sent: false, channel: 'email', reason: 'disabled_or_missing_target' };
  }

  await mailTransporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to,
    subject,
    html,
    text,
  });

  return { sent: true, channel: 'email' };
};

const sendSms = async ({ to, body }) => {
  if (!smsClient || !process.env.TWILIO_PHONE_NUMBER || !to) {
    return { sent: false, channel: 'sms', reason: 'disabled_or_missing_target' };
  }

  await smsClient.messages.create({
    body,
    from: process.env.TWILIO_PHONE_NUMBER,
    to,
  });

  return { sent: true, channel: 'sms' };
};

const sendNotification = async ({ user, subject, messageHtml, messageText }) => {
  const tasks = [];

  if (user?.email) {
    tasks.push(
      sendEmail({
        to: user.email,
        subject,
        html: messageHtml,
        text: messageText,
      }).catch((error) => ({ sent: false, channel: 'email', error: error.message }))
    );
  }

  if (user?.phone) {
    tasks.push(
      sendSms({
        to: user.phone,
        body: messageText,
      }).catch((error) => ({ sent: false, channel: 'sms', error: error.message }))
    );
  }

  return Promise.all(tasks);
};

module.exports = {
  sendNotification,
};
