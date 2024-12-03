import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const NEXT_APP_NAME = process.env.NEXT_PUBLIC_APP_URL;

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const response = await resend.emails.send({
      from: `no-reply@${NEXT_APP_NAME}`, // Replace with a verified sender email
      to,
      subject,
      html,
    });
    console.log('Email sent successfully:', response);
    return response;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};