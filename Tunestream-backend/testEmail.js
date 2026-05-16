import dotenv from 'dotenv';
dotenv.config();

import sendEmail from './src/utils/sendEmail.js';

console.log('--- Testing dual-provider email to oldmemories021@gmail.com ---');

sendEmail({
  email: 'oldmemories021@gmail.com',
  subject: 'TuneStream Signup Code',
  message: 'Your verification code is: 654321. It expires in 5 minutes.',
  html: '<div style="font-family:sans-serif;text-align:center;max-width:400px;margin:0 auto;padding:20px;border:1px solid #eee;border-radius:10px"><h2 style="color:#10b981">Verify your account</h2><p>Your OTP is:</p><h1 style="color:#10b981;letter-spacing:5px;background:#f9f9f9;padding:10px;border-radius:5px">654321</h1><p style="color:#666;font-size:12px">Expires in 5 minutes.</p></div>'
}).then(result => {
  if (result) console.log('DONE - Email delivered to oldmemories021@gmail.com');
  else console.log('FAILED - Could not deliver email');
}).catch(err => console.error('FAILED:', err));
