import { resend } from "../../config/resend.js";

// Function to make sure scripts aren't send through email and ran
function escapeHtml(str) {
    return str.replace(/[&<>"']/g, c =>
        ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
    );
}


export async function sendEmail(req, res) {
    // Make sure my env vars are present
    if (!process.env.CONTACT_FROM_EMAIL || !process.env.CONTACT_TO_EMAIL) {
        throw new Error("Contact email env vars missing");
    }

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

        // Check email is valid
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({ error: 'Invalid email address' });
        }

        // Format the subject depending on if its present
        const name = [firstName, lastName].filter(Boolean).join(' ');
        const subject = name ? `Portfolio Contact — ${name}` : 'Portfolio Contact';

        // Try to send the email
        await resend.emails.send({
            from: process.env.CONTACT_FROM_EMAIL,
            to: process.env.CONTACT_TO_EMAIL,
            replyTo: email,
            subject: subject,
            html: `
        <p><strong>Name:</strong> ${firstName ?? ''} ${lastName ?? ''}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, '<br/>')}</p>
      `,
        });

        return res.status(200).json({ success: true });
    } catch (err) {
        console.error('Contact form error:', err);
        return res.status(500).json({ error: 'Failed to send message' });
    }
}