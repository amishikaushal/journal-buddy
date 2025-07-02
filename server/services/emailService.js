import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export const sendJournalReminder = async (userEmail, userName) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: '📝 Time to Write in Your Journal',
      html: `
        <h2>Hello ${userName}!</h2>
        <p>Don't forget to write in your journal today. Taking a few minutes to reflect can make a big difference in your day.</p>
        <p>Click <a href="${process.env.CLIENT_URL}">here</a> to start writing.</p>
        <br>
        <p>Best regards,</p>
        <p>Your Journal Buddy</p>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};