import nodemailer from 'nodemailer';

const createResendTransporter = () => {
  if (!process.env.SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.resend.com',
    port: parseInt(process.env.SMTP_PORT) || 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER || 'resend',
      pass: process.env.SMTP_PASS,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
  });
};

const createGmailTransporter = () => {
  if (!process.env.GMAIL_APP_PASSWORD) return null;
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
  });
};

const sendEmail = async (options) => {
  const fromEmail = process.env.FROM_EMAIL || process.env.GMAIL_USER || 'noreply@tunestream.com';
  const fromName = process.env.FROM_NAME || 'TuneStream';

  const message = {
    from: `"${fromName}" <${fromEmail}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  // Strategy: Try Resend first, fall back to Gmail if Resend rejects (free-tier domain limit)
  const resendTransporter = createResendTransporter();
  if (resendTransporter) {
    try {
      const info = await resendTransporter.sendMail(message);
      console.log('✅ Email sent via Resend: %s', info.messageId);
      return true;
    } catch (error) {
      console.warn('⚠️ Resend failed:', error.message, '- Falling back to Gmail...');
    }
  }

  // Fallback: Gmail SMTP
  const gmailTransporter = createGmailTransporter();
  if (gmailTransporter) {
    try {
      // Use Gmail's own address as sender for Gmail transport
      const gmailMessage = {
        ...message,
        from: `"${fromName}" <${process.env.GMAIL_USER}>`,
      };
      const info = await gmailTransporter.sendMail(gmailMessage);
      console.log('✅ Email sent via Gmail: %s', info.messageId);
      return true;
    } catch (error) {
      console.error('❌ Gmail also failed:', error.message);
    }
  }

  // Both failed — log for development
  console.error('❌ All email providers failed for:', options.email);
  if (process.env.NODE_ENV !== 'production') {
    console.log('\n--- [DEVELOPMENT] MOCK EMAIL ---');
    console.log('To:', options.email);
    console.log('Subject:', options.subject);
    console.log('Content:', options.message || 'HTML Content Sent');
    console.log('-------------------------------\n');
    return true;
  }
  return false;
};

export default sendEmail;
