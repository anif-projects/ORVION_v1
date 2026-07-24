const { createTransporter } = require('../config/smtp');

class EmailService {
  async sendOTP(toEmail, otpCode) {
    console.log(`[EmailService] OTP Code generated for ${toEmail}: >>> ${otpCode} <<<`);

    if (!process.env.SMTP_USER) {
      console.log(`[EmailService] SMTP_USER not set. OTP logged to console.`);
      return;
    }

    try {
      const transporter = createTransporter();
      const mailOptions = {
        from: process.env.EMAIL_FROM || `"LMS Platform" <${process.env.SMTP_USER}>`,
        to: toEmail,
        subject: 'Verify Your Email - LMS Platform',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 24px; background: #0f172a; color: #fff; borderRadius: 16px;">
            <h2 style="color: #4f46e5; margin-bottom: 8px;">Welcome to LMS Platform!</h2>
            <p style="color: #94a3b8; font-size: 14px;">Your 6-digit email verification security code is:</p>
            <div style="font-size: 36px; font-weight: 800; letter-spacing: 6px; color: #06b6d4; margin: 24px 0; padding: 12px; background: #1e293b; border-radius: 12px; text-align: center;">
              ${otpCode}
            </div>
            <p style="color: #64748b; font-size: 12px;">This code will expire in 10 minutes. If you did not request this, please ignore.</p>
          </div>
        `,
      };

      // Non-blocking mail attempt with 15s timeout
      await Promise.race([
        transporter.sendMail(mailOptions),
        new Promise((_, reject) => setTimeout(() => reject(new Error('SMTP Timeout')), 15000)),
      ]);
      console.log(`[EmailService] OTP email sent successfully to ${toEmail}`);
    } catch (err) {
      console.warn(`[EmailService Warning]: Could not send email via SMTP (${err.message}). Dev fallback active for ${toEmail}: Code is ${otpCode}`);
    }
  }
}

module.exports = new EmailService();
