const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASS, 
    }
});

const sendEmail = async ({ to, subject, text, html }) => {
    try {
        await transporter.sendMail({
            from: `"Your OJ Project" <${process.env.EMAIL_ID}>`,
            to,
            subject,
            text,
            html,
        });
        console.log('Email sent successfully to:', to);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Email could not be sent.');
    }
};

module.exports = sendEmail;