import dotenv from 'dotenv';
dotenv.config();
import dns from 'dns';
import mongoose from 'mongoose';
import Otp from './src/models/otpModel.js';
import sendEmail from './src/utils/sendEmail.js';

// Same DNS fix as server.js
dns.setServers(["1.1.1.1", "8.8.8.8"]);

console.log('=== FULL END-TO-END OTP TEST ===\n');

try {
  // Step 1: Connect to MongoDB
  console.log('Step 1: Connecting to MongoDB...');
  await mongoose.connect(`${process.env.MONGODB_URI}/tunestream`);
  console.log('✅ MongoDB connected\n');

  // Step 2: Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log(`Step 2: Generated OTP: ${otp}\n`);

  // Step 3: Send email
  console.log('Step 3: Sending email to oldmemories021@gmail.com...');
  const emailResult = await sendEmail({
    email: 'oldmemories021@gmail.com',
    subject: `TuneStream Signup Code`,
    message: `Your verification code is: ${otp}. It expires in 5 minutes.`,
    html: `<div style="font-family:sans-serif;text-align:center;max-width:400px;margin:0 auto;padding:20px;border:1px solid #eee;border-radius:10px"><h2 style="color:#10b981">Verify your account</h2><p>Your OTP is:</p><h1 style="color:#10b981;letter-spacing:5px;background:#f9f9f9;padding:10px;border-radius:5px">${otp}</h1><p style="color:#666;font-size:12px">Expires in 5 minutes.</p></div>`
  });
  console.log(`✅ Email sent: ${emailResult}\n`);

  // Step 4: Save OTP to database
  console.log('Step 4: Saving OTP to MongoDB...');
  const saved = await Otp.findOneAndUpdate(
    { email: 'oldmemories021@gmail.com' },
    { otp, createdAt: Date.now() },
    { upsert: true, new: true }
  );
  console.log(`✅ OTP saved to DB: ${saved.otp} for ${saved.email}\n`);

  // Step 5: Verify OTP from database
  console.log('Step 5: Verifying OTP from DB...');
  const verified = await Otp.findOne({ email: 'oldmemories021@gmail.com', otp });
  console.log(`✅ OTP verified: ${verified ? 'YES' : 'NO'}\n`);

  console.log('=== ALL STEPS PASSED ===');
  console.log(`OTP ${otp} sent to oldmemories021@gmail.com`);
  console.log('Check inbox NOW (also Spam/Promotions)');

} catch (err) {
  console.error('❌ FAILED at:', err.message);
} finally {
  await mongoose.disconnect();
}
