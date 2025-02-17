// filepath: /d:/GithubProjects/ecopote/libs/shared/nodemailer/azuremailer.ts
import { EmailClient, EmailMessage } from '@azure/communication-email';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.AZURE_COMMUNICATION_CONNECTION_STRING;
if (!connectionString) {
  throw new Error('AZURE_COMMUNICATION_CONNECTION_STRING is not defined');
}
const emailClient = new EmailClient(connectionString);

export const sendEmailAzure = async (
  to: string,
  subject: string,
  htmlContent: string
) => {
  const emailMessage: EmailMessage = {
    senderAddress: process.env.SENDER_EMAIL_ADDRESS || '',
    content: {
      subject: subject,
      plainText: '',
      html: htmlContent,
    },
    recipients: {
      to: [
        {
          address: to,
        },
      ],
    },
  };

  try {
    const poller = await emailClient.beginSend(emailMessage);
    const response = await poller.pollUntilDone();
    return response;
    console.log(`Email sent successfully: ${response.id}`);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
};
