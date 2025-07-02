import cron from 'node-cron';
import User from '../models/User.js';
import { sendJournalReminder } from './emailService.js';

export const startReminderService = () => {
  // Run every day at 10:00 AM
  cron.schedule('0 10 * * *', async () => {
    try {
      const users = await User.find({ reminderEnabled: true });
      
      for (const user of users) {
        await sendJournalReminder(user.email, user.name);
      }
      
      console.log(`Sent reminders to ${users.length} users`);
    } catch (error) {
      console.error('Failed to send reminders:', error);
    }
  });
};