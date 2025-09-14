// This shared utility function sends an email using the Resend API.
// It centralizes the email sending logic to be reused by multiple Edge Functions.
// It requires one environment variable to be set in your Supabase project:
// 1. RESEND_API_KEY: Your API key from Resend.

// @ts-ignore
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

interface EmailParams {
  from: string;
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ from, to, subject, html }: EmailParams) => {
  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set in environment variables.');
    // In a real production environment, you might want to return a more graceful error.
    // For this context, we throw to make the configuration issue obvious during development.
    throw new Error('Email service is not configured: Missing RESEND_API_KEY.');
  }
   if (!from) {
      console.error('Sender email ("from" address) is not provided.');
      throw new Error('Email service is not configured: Missing sender email.');
   }

  console.log(`Sending email to: ${to} from: ${from}`);

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      html,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error('Failed to send email:', JSON.stringify(data, null, 2));
    throw new Error(data.message || 'An error occurred while sending the email.');
  }
  
  console.log('Email sent successfully:', data.id);
  return data;
};