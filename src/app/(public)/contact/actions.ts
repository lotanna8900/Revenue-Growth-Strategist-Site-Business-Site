'use server';

import { Resend } from 'resend';

type FormState = {
  message: string;
  isError: boolean;
};

export async function submitContactForm(
  previousState: FormState | null,
  formData: FormData,
): Promise<FormState> {
  
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const subject = formData.get('subject') as string;
  const message = formData.get('message') as string;

  if (!name || !email || !subject || !message) {
    return { message: 'Please fill out all fields.', isError: true };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const emailTo = process.env.CONTACT_FORM_EMAIL_TO;

  if (!emailTo) {
    console.error('CONTACT_FORM_EMAIL_TO is not set in .env.local');
    return { message: 'Server configuration error.', isError: true };
  }

  try {
    await resend.emails.send({
      from: 'chiamaka@successdrivenamaka.com.ng', 
      to: emailTo,
      subject: `New Contact Form Submission: ${subject}`,
      replyTo: email,
      html: `
        <p>You received a new message from the contact form:</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    return { message: 'Success! Your message has been sent.', isError: false };

  } catch (error) {
    console.error('Resend error:', error);
    return { message: 'Failed to send message.', isError: true };
  }
}