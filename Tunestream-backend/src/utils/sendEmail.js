import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // Use environment variables or fallback to Mailtrap for testing
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "sandbox.smtp.mailtrap.io",
    port: process.env.SMTP_PORT || 2525,
    auth: {
      user: process.env.SMTP_USER || "test_user", // Replace with real credentials in .env
      pass: process.env.SMTP_PASS || "test_pass",
    },
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
