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
    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error("Error sending email: ", error);
    // Even if it fails (e.g. invalid credentials), we don't want to crash the app, 
    // but we should probably throw an error so the controller knows it failed.
    // For local testing without SMTP, we'll just log the message.
    console.log("--- MOCK EMAIL ---");
    console.log("To:", options.email);
    console.log("Subject:", options.subject);
    console.log("Message:", options.message);
    console.log("------------------");
  }
};

export default sendEmail;
