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
  html: string
) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.MAIL_USER, // Sender address
      to: user.email, // Recipient address
      subject: subject, // Subject line
      text: html, // Plain text body
      // html: `<p>${body}</p>`, // HTML body
    });
    console.log(`Email sent to ${user.email}: ${info.messageId}`);
  } catch (error) {
    console.error(`Failed to send email to ${user.email}:`, error);
  }
};

// Main function to send emails
export const sendBulkEmails = async (
  users: User[],
  subject: string,
  html: string
) => {
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    await emailSender(user, subject, html);

    // Rate limiting to avoid getting blocked
    await new Promise((resolve) => setTimeout(resolve, 500)); // 500ms delay
  }

  return 'All emails sent successfully';
};
