import { execSync } from 'child_process';

const vars = [
  ['CLOUDINARY_API_SECRET', 'MF1zOa8UcvlOS9_68z0H-BN_1rk'],
  ['JWT_SECRET', 'your_jwt_secret'],
  ['JWT_REFRESH_SECRET', 'your_jwt_refresh_secret'],
  ['NODE_ENV', 'production'],
  ['GMAIL_USER', 'microsofty543@gmail.com'],
  ['GMAIL_APP_PASSWORD', 'mvrwdnuwtokgkkcz'],
  ['SMTP_HOST', 'smtp.resend.com'],
  ['SMTP_PORT', '465'],
  ['SMTP_USER', 'resend'],
  ['SMTP_PASS', 're_RKkjVZ9P_5iTdK1dGyLUCooPu5VatfaLE'],
  ['FROM_EMAIL', 'onboarding@resend.dev'],
  ['FROM_NAME', 'TuneStream'],
  ['FRONTEND_URL', 'https://www-tunestream-home.vercel.app'],
  ['ADMIN_URL', 'https://www-tunestream-admin.vercel.app']
];

for (const [key, value] of vars) {
  try {
    console.log(`Adding ${key}...`);
    execSync(`vercel env add ${key} production --value "${value}" --yes --force`, { cwd: 'c:\\Tunestream-Mern_stack-main\\Tunestream-Mern_stack-main\\Tunestream-backend', stdio: 'inherit' });
    console.log(`✅ ${key} added.`);
  } catch (e) {
    console.error(`❌ Failed to add ${key}: ${e.message}`);
  }
}
