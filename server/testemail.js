require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
    console.log("1. Starting Email Test...");
    console.log(`   Host: ${process.env.SMTP_HOST}`);
    console.log(`   User: ${process.env.SMTP_USER}`);

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    try {
        console.log("2. Verifying connection...");
        await transporter.verify();
        console.log("   ✅ Connection Successful!");

        console.log("3. Sending test email...");
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER, // Must be a verified sender in Brevo
            to: process.env.EMAIL_USER,   // Send to yourself
            subject: "Test Email from Localhost",
            text: "If you see this, Brevo is working!"
        });
        console.log("   ✅ Email sent: " + info.messageId);

    } catch (error) {
        console.error("   ❌ ERROR FAILED:");
        console.error(error);
    }
}

testEmail();