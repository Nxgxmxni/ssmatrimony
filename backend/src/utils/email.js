const nodemailer = require('nodemailer');

// Configure Transporter with SMTP or fallback test logger
const createTransporter = () => {
  const host = process.env.EMAIL_HOST || process.env.SMTP_HOST;
  const user = process.env.EMAIL_USER || process.env.SMTP_USER;
  const pass = process.env.EMAIL_PASS || process.env.SMTP_PASS;
  const port = parseInt(process.env.EMAIL_PORT || process.env.SMTP_PORT || '587', 10);

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  // Fallback Ethereal / Console logger for local development
  return {
    sendMail: async (options) => {
      console.log('\n==================================================');
      console.log(' 📧 [EMAIL SERVICE - DEV CONSOLE LOG]');
      console.log(` 📩 To: ${options.to}`);
      console.log(` 📌 Subject: ${options.subject}`);
      console.log('--------------------------------------------------');
      console.log(options.text || 'HTML Email Sent (See options.html)');
      console.log('==================================================\n');
      return { messageId: 'dev-console-email-id' };
    },
  };
};

const transporter = createTransporter();
const EMAIL_FROM = process.env.EMAIL_FROM || 'SS Matrimony <noreply@ssmatrimony.com>';

// Helper: Common HTML Template Wrapper
const getHtmlWrapper = (title, contentHtml) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #334155; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
    .header { background: linear-gradient(135deg, #0B3B91 0%, #051329 100%); padding: 30px 20px; text-align: center; border-bottom: 3px solid #D4AF37; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 1px; }
    .header span { color: #D4AF37; }
    .body { padding: 35px 30px; line-height: 1.7; }
    .body h2 { color: #0F172A; font-size: 20px; margin-top: 0; }
    .btn { display: inline-block; background: linear-gradient(135deg, #D4AF37 0%, #B45309 100%); color: #ffffff !important; font-weight: 700; text-decoration: none; padding: 14px 32px; border-radius: 50px; margin: 24px 0; box-shadow: 0 4px 15px rgba(212,175,55,0.35); text-align: center; }
    .footer { background: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
    .footer a { color: #0B3B91; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>SS <span>MATRIMONY</span></h1>
      <p style="color: #cbd5e1; margin: 5px 0 0; font-size: 13px;">Premier Telugu Matrimonial Platform</p>
    </div>
    <div class="body">
      ${contentHtml}
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} SS Matrimony. All Rights Reserved.</p>
      <p>Helping Telugu families unite with trust, culture, and lifelong happiness.</p>
    </div>
  </div>
</body>
</html>
`;

// 1. Send Email Verification Link
const sendVerificationEmail = async (toEmail, fullName, token) => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const verificationLink = `${clientUrl}/verify-email/${token}`;

  const htmlContent = `
    <h2>Welcome to SS Matrimony, ${fullName}! 🙏</h2>
    <p>Thank you for registering your profile with SS Matrimony. We are delighted to assist you on your journey to finding your forever soulmate.</p>
    <p>Please click the button below to verify your email address and activate full profile features:</p>
    <div style="text-align: center;">
      <a href="${verificationLink}" class="btn">Verify Email Address</a>
    </div>
    <p style="font-size: 13px; color: #64748b;">If the button above does not work, copy and paste the link below into your browser:</p>
    <p style="font-size: 13px; color: #0B3B91; word-break: break-all;">${verificationLink}</p>
    <p style="margin-top: 20px; font-size: 13px;">This verification link will expire in 24 hours.</p>
  `;

  return await transporter.sendMail({
    from: EMAIL_FROM,
    to: toEmail,
    subject: '💍 Verify Your Email Address - SS Matrimony',
    html: getHtmlWrapper('Verify Your Email Address', htmlContent),
    text: `Welcome to SS Matrimony, ${fullName}! Please verify your email by opening this link: ${verificationLink}`,
  });
};

// 2. Send Forgot Password Reset Token Email
const sendForgotPasswordEmail = async (toEmail, token) => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const resetLink = `${clientUrl}/reset-password/${token}`;

  const htmlContent = `
    <h2>Password Reset Request 🔐</h2>
    <p>We received a request to reset the password for your SS Matrimony account associated with <strong>${toEmail}</strong>.</p>
    <p>Click the button below to choose a new password:</p>
    <div style="text-align: center;">
      <a href="${resetLink}" class="btn">Reset Password</a>
    </div>
    <p style="font-size: 13px; color: #64748b;">Or paste this link into your browser:</p>
    <p style="font-size: 13px; color: #0B3B91; word-break: break-all;">${resetLink}</p>
    <p style="margin-top: 20px; font-size: 13px; color: #e11d48;"><strong>Security Note:</strong> This reset link expires in 1 hour. If you did not request a password reset, please ignore this email or contact support immediately.</p>
  `;

  return await transporter.sendMail({
    from: EMAIL_FROM,
    to: toEmail,
    subject: '🔐 Password Reset Instructions - SS Matrimony',
    html: getHtmlWrapper('Password Reset Request', htmlContent),
    text: `Reset your SS Matrimony password by visiting: ${resetLink}`,
  });
};

// 3. Send Password Changed Notification Email
const sendPasswordChangedEmail = async (toEmail, fullName) => {
  const htmlContent = `
    <h2>Password Updated Successfully ✅</h2>
    <p>Dear ${fullName || 'User'},</p>
    <p>This is a security notification to confirm that your password for your SS Matrimony account was changed successfully on ${new Date().toLocaleString()}.</p>
    <p>If you made this change, no further action is required.</p>
    <p style="color: #e11d48; font-size: 13px;">If you did NOT change your password, please contact our support team immediately at <strong>ssmatrimony2018@gmail.com</strong> or +91 78930 69580.</p>
  `;

  return await transporter.sendMail({
    from: EMAIL_FROM,
    to: toEmail,
    subject: '🛡️ Security Alert: Your Password Was Changed - SS Matrimony',
    html: getHtmlWrapper('Password Changed', htmlContent),
    text: `Your SS Matrimony password was successfully changed. If this was not you, contact support immediately.`,
  });
};

module.exports = {
  sendVerificationEmail,
  sendForgotPasswordEmail,
  sendPasswordChangedEmail,
};
