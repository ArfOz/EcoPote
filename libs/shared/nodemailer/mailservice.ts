import nodemailer from 'nodemailer';

export const emailSender = async (emailData: {
  to: string;
  subject: string;
  html: string;
}) => {
  const email = {
    to: 'recipient@example.com', // Replace with recipient email
    subject: 'Test Email', // Replace with email subject
    html: '<p>This is a test email</p>', // Replace with email content
  };

  const transporter = nodemailer.createTransport({
    host: 'smtp.example.com', // Replace with your SMTP server
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'your-email@example.com', // Replace with your email
      pass: 'your-email-password', // Replace with your email password
    },
  });

  const mailOptions = {
    from: '"Your Name" <your-email@example.com>', // Replace with your email
    to: email.to,
    subject: email.subject,
    html: email.html,
  };

  return await transporter.sendMail(mailOptions);
};
