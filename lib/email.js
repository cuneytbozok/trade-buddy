import { Resend } from 'resend';
import { PasswordResetEmail } from '@/emails/password-reset'; // Adjust based on your template structure

const resend = new Resend(process.env.RESEND_API_KEY);

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not defined in the environment variables.");
}

if (!process.env.NEXT_PUBLIC_APP_URL) {
  throw new Error("NEXT_PUBLIC_APP_URL is not defined in the environment variables.");
}

export const sendEmail = async ({ to, subject, resetUrl, name }) => {
  try {
    const response = await resend.emails.send({
      from: `no-reply@${new URL(process.env.NEXT_PUBLIC_APP_URL).hostname}`, // Dynamically set domain
      to,
      subject,
      react: <PasswordResetEmail resetUrl={resetUrl} name={name} />,
    });

    if (response.error) {
      throw new Error(`Email sending failed: ${response.error.message}`);
    }

    console.log('Email sent successfully:', response);
    return response;
  } catch (error) {
    console.error('Error sending email:', error.message || error);
    throw new Error('Failed to send email. Please check your email service configuration.');
  }
};