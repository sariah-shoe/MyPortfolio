import { resend } from "../../config/resend.js";

export async function sendEmail(req, res) {
    try {
        // Make sure all my fields are present
        const {
            firstName,
            lastName,
            email,
            message,
            company,
        } = req.body;

        // Check honeypot field
        if (company) {
            return res.status(200).end();
        }

        // Check required fields
        if (!email || !message) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Try to send the email
        await resend.emails.send({
            from: process.env.CONTACT_FROM_EMAIL,
            to: process.env.CONTACT_TO_EMAIL,
            replyTo: email,
            subject: `Portfolio Contact — ${firstName ?? ''} ${lastName ?? ''}`.trim(),
            html: `
        <p><strong>Name:</strong> ${firstName ?? ''} ${lastName ?? ''}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br/>')}</p>
      `,
        });

        return res.status(200).json({ success: true });
    } catch (err) {
        console.error('Contact form error:', err);
        return res.status(500).json({ error: 'Failed to send message' });
    }
}