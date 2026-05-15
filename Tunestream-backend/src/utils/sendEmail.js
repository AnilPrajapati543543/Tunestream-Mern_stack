import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // Use Gmail SMTP for real-world OTP delivery
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    auth: {
      user: process.env.GMAIL_USER || process.env.SMTP_USER, 
      pass: process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS,
    },
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,
  });

  const message = {
    from: `${process.env.FROM_NAME || 'Tunestream'} <${process.env.FROM_EMAIL || 'noreply@tunestream.com'}>`,
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
