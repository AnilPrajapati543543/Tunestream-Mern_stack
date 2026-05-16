import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // Use explicit Gmail SMTP settings for maximum deliverability
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
      user: process.env.GMAIL_USER || process.env.SMTP_USER, 
      pass: process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS,
    },
    connectionTimeout: 10000, 
    greetingTimeout: 10000,
  });

  const fromEmail = process.env.GMAIL_USER || process.env.FROM_EMAIL || 'noreply@tunestream.com';
  const fromName = process.env.FROM_NAME || 'Tunestream';

  const message = {
    from: `"${fromName}" <${fromEmail}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  try {
    const info = await transporter.sendMail(message);
    console.log('✅ Email sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error("❌ Error sending email: ", error.message);
    
    // For local development without SMTP credentials, we'll log the OTP/Link to the console
    if (process.env.NODE_ENV !== 'production') {
      console.log("\n--- [DEVELOPMENT] MOCK EMAIL ---");
      console.log("To:", options.email);
      console.log("Subject:", options.subject);
      console.log("Content:", options.message || "HTML Content Sent");
      console.log("-------------------------------\n");
      return true;
    }
    return false;
  }
};

export default sendEmail;
