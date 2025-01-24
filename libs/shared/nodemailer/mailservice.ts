import { User } from '@prisma/client';
import nodemailer, { TransportOptions } from 'nodemailer';

const transporter = nodemailer.createTransport(<TransportOptions>{
  host: 'smtp.gmail.com', // Replace with your SMTP server
  port: 465,
  secure: true,
  // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_USER, // Replace with your email
    pass: process.env.MAIL_PASSWORD, // Replace with your email password
  },
});

export const emailSender = async (
  user: User,
  subject: string,
  html: string,
  sentUsers: User[],
  errorUsers: User[]
) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.MAIL_USER, // Sender address
      to: user.email, // Recipient address
      subject: subject || 'Mon Eco pote', // Subject line
      html: html, // Plain html body
    });
    console.log(`Email sent to ${user.email}: ${info.messageId}`);
    sentUsers.push(user);
  } catch (error) {
    console.error(`Failed to send email to ${user.email}:`, error);
    errorUsers.push(user);
  }
};

// Main function to send emails
export const sendBulkEmails = async (
  users: User[],
  subject: string,
  html: string
) => {
  const BATCH_SIZE = 100; // Adjust the batch size as needed
  const sentUsers: User[] = [];
  const errorUsers: User[] = [];

  const sendEmailBatch = async (batch: User[]) => {
    const promises = batch.map((user) =>
      emailSender(user, subject, html, sentUsers, errorUsers)
    );
    await Promise.all(promises);
  };

  for (let i = 0; i < users.length; i += BATCH_SIZE) {
    const batch = users.slice(i, i + BATCH_SIZE);
    await sendEmailBatch(batch);

    // Rate limiting to avoid getting blocked
    await new Promise((resolve) => setTimeout(resolve, 500)); // 500ms delay
  }

  console.log('Sent Users:', sentUsers);
  console.log('Error Users:', errorUsers);

  return { sentUsers, errorUsers };
};
