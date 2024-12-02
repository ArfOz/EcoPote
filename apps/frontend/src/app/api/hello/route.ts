import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

// E-posta verisini alacak tür
interface EmailData {
  emails: string[];
  subject: string;
  message: string;
}

// API route
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const { emails, subject, message }: EmailData = req.body;

  // E-posta verisinin doğruluğunu kontrol et
  if (!emails || !subject || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Nodemailer için transporter oluşturma
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // Gmail kullanıyorsanız
      auth: {
        user: process.env.EMAIL_USER, // .env dosyasından alınacak
        pass: process.env.EMAIL_PASS, // .env dosyasından alınacak
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER, // Gönderen e-posta adresi
      to: emails.join(','), // Birden fazla e-posta adresi virgülle ayrılır
      subject: subject,
      text: message,
    };

    // E-postayı gönderme
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Emails sent successfully!' });
  } catch (error) {
    console.error('Error sending emails:', error);
    res.status(500).json({ message: 'Error sending emails', error });
  }
}
