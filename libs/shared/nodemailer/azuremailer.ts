// filepath: /d:/GithubProjects/ecopote/libs/shared/nodemailer/azuremailer.ts
import { EmailClient, EmailMessage } from '@azure/communication-email';
import { User } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.AZURE_COMMUNICATION_CONNECTION_STRING;
if (!connectionString) {
  throw new Error('AZURE_COMMUNICATION_CONNECTION_STRING is not defined');
}
const emailClient = new EmailClient(connectionString);

export const sendEmailAzure = async (
  to: User[],
  subject: string,
  htmlContent: string
) => {
  const sentUsers: string[] = [];
  const errorUsers: string[] = [];
  const emailMessage: EmailMessage = {
    senderAddress: process.env.SENDER_EMAIL_ADDRESS || '',
    content: {
      subject: subject,
      plainText: '',
      html: htmlContent,
    },
    recipients: {
      to: to.map((user) => ({ address: user.email, displayName: user.email })),
    },
  };

  try {
    const poller = await emailClient.beginSend(emailMessage);
    const response = await poller.pollUntilDone();
    console.log('Email sent:', response);
    if (response.status === 'Succeeded') {
      sentUsers.push(...to.map((user) => user.email));
    } else {
      errorUsers.push(...to.map((user) => user.email));
    }

    return { sentUsers, errorUsers };
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Failed to send email');
  }
};
