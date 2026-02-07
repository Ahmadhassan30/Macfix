import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
    // If credentials are not set, simulate email sending
    if (!process.env.SMTP_USER || process.env.SMTP_USER.includes('your-email')) {
        console.log('⚠️ SMTP credentials not configured. Email simulation:');
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log('--- HTML content suppressed ---');
        return { success: true, simulated: true };
    }

    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || `"MacFix Support" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html,
        });
        console.log('Email sent: %s', info.messageId);
        return { success: true, data: info };
    } catch (error) {
        console.error('Email failed:', error);
        return { success: false, error };
    }
}
