import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config({ path: 'c:/Tunestream-Mern_stack-main/Tunestream-Mern_stack-main/Tunestream-backend/.env' });

const sendEmailTest = async () => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const message = {
    from: `Tunestream <${process.env.GMAIL_USER}>`,
    to: 'microsofty543@gmail.com', // sending to self for testing
    subject: 'Test OTP delivery',
    text: 'Your test OTP is 123456',
  };

  try {
    console.log('Attempting to send email...');
    const info = await transporter.sendMail(message);
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    if (error.stack) console.error(error.stack);
  }
};

sendEmailTest();
