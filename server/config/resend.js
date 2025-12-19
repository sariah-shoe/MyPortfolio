// src/services/resend.ts
import { Resend } from 'resend';

// Check I have the required .env variables
if (!process.env.RESEND_API_KEY) {
  throw new Error("Missing RESEND_API_KEY");
}

// Export my resend client for contact me emails
export const resend = new Resend(process.env.RESEND_API_KEY);