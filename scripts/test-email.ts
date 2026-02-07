import { sendEmail } from '../src/lib/email';

async function main() {
    console.log('Testing Email Configuration...');

    // Replace with your email manually if needed for testing, or rely on .env
    const testRecipient = process.env.SMTP_USER || 'test@example.com';

    console.log(`Sending test email to: ${testRecipient}`);

    const result = await sendEmail({
        to: testRecipient,
        subject: 'MacFix - SMTP Test',
        html: '<h1>It works!</h1><p>Your Nodemailer configuration is correct.</p>'
    });

    console.log('Result:', result);

    if (result.simulated) {
        console.log('\n⚠️ Email was simulated because SMTP_USER is missing or default.');
        console.log('Please configuring .env with real SMTP credentials.');
    }
}

main();
