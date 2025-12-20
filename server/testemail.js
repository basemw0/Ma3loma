require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.resend.com',
    secure: true,
    port: 465,
    auth: {
        user: 'resend',
        pass: process.env.EMAIL_PASS,
    },
});

async function sendTestEmail() {
    try {
        const info = await transporter.sendMail({
            from: 'noreply@ma3loma.online', // Must be this until you verify a domain
            to: 'basemwalid44@gmail.com', // Replace with your email to test
            subject: 'Resend SMTP Test',
            html: '<strong>It works!</strong>',
        });
        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

sendTestEmail();