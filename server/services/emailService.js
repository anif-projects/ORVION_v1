const { createTransporter } = require('../config/smtp');
const path = require('path');

class EmailService {
  async sendOTP(toEmail, otpCode) {
    console.log(`[EmailService] OTP Code generated for ${toEmail}: >>> ${otpCode} <<<`);

    if (!process.env.SMTP_USER) {
      console.log(`[EmailService] SMTP_USER not set. OTP logged to console.`);
      return;
    }

    try {
      const transporter = createTransporter();
      const logoPath = path.join(__dirname, '../../frontend/public/logo.png');

      const mailOptions = {
        from: process.env.EMAIL_FROM || `"Orvion Learn" <${process.env.SMTP_USER}>`,
        to: toEmail,
        subject: 'Verify Your Email - Orvion Learn',
        text: `Welcome to Orvion! Please use the following 6-digit security code to verify your account and complete your registration: ${otpCode}. This code is valid for 10 minutes.`,
        html: `
          <div style="background-color: #f8fafc; padding: 40px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; width: 100%; margin: 0; text-align: center;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 550px; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); border: 1px solid #f1f5f9; margin: 0 auto; text-align: left; border-collapse: collapse;">
              
              <!-- Header with Logo -->
              <tr>
                <td align="center" style="background-color: #ffffff; padding: 32px 20px 20px 20px; border-bottom: 1px solid #f1f5f9; text-align: center;">
                  <img src="cid:orvion-logo" alt="Orvion Logo" width="220" style="display: inline-block; border: 0; outline: none; text-decoration: none;" />
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding: 40px 40px 32px 40px; text-align: center;">
                  <h2 style="color: #0f172a; font-size: 22px; font-weight: 800; margin: 0 0 16px 0;">Verify Your Email Address</h2>
                  <p style="color: #475569; font-size: 15px; line-height: 24px; margin: 0 0 24px 0;">
                    Welcome to Orvion! Please use the following 6-digit security code to verify your account and complete your registration.
                  </p>

                  <!-- Code Block -->
                  <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 30px auto;">
                    <tr>
                      <td align="center" style="background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); padding: 18px 40px; border-radius: 20px; border: 1px dashed #cbd5e1;">
                        <span style="font-family: 'Courier New', Courier, monospace; font-size: 38px; font-weight: 800; letter-spacing: 8px; color: #b45309; display: block; margin: 0; line-height: 1; padding-left: 8px;">
                          ${otpCode}
                        </span>
                      </td>
                    </tr>
                  </table>

                  <p style="color: #64748b; font-size: 13px; line-height: 20px; margin: 0;">
                    This code is valid for <strong>10 minutes</strong>. If you did not request this verification, you can safely ignore this email.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #fafaf9; padding: 24px 40px; text-align: center; border-top: 1px solid #f1f5f9;">
                  <p style="color: #a8a29e; font-size: 11px; margin: 0 0 6px 0; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">
                    Orvion Learn
                  </p>
                  <p style="color: #d6d3d1; font-size: 11px; margin: 0;">
                    Unlock The Future • Secure Telemetry Enabled
                  </p>
                </td>
              </tr>

            </table>
          </div>
        `,
        attachments: [
          {
            filename: 'logo.png',
            path: logoPath,
            cid: 'orvion-logo'
          }
        ]
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

  async sendPurchaseConfirmation(toEmail, studentName, itemTitle, amount) {
    console.log(`[EmailService] Purchase Confirmation generated for ${toEmail}: ${itemTitle} (INR ${amount})`);

    if (!process.env.SMTP_USER) {
      console.log(`[EmailService] SMTP_USER not set. Purchase confirmation logged to console.`);
      return;
    }

    try {
      const transporter = createTransporter();
      const logoPath = path.join(__dirname, '../../frontend/public/logo.png');

      const mailOptions = {
        from: process.env.EMAIL_FROM || `"Orvion Learn" <${process.env.SMTP_USER}>`,
        to: toEmail,
        subject: `Successful Purchase: ${itemTitle} - Orvion Learn`,
        text: `Hello ${studentName},\n\nThank you for enrolling in/registering for ${itemTitle}. We have successfully processed your payment of INR ${amount} via Razorpay.\n\nYou can access your dashboard here: ${process.env.CLIENT_URL || 'http://localhost:5173'}/student/dashboard`,
        html: `
          <div style="background-color: #f8fafc; padding: 40px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; width: 100%; margin: 0; text-align: center;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 550px; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); border: 1px solid #f1f5f9; margin: 0 auto; text-align: left; border-collapse: collapse;">
              
              <!-- Header with Logo -->
              <tr>
                <td align="center" style="background-color: #ffffff; padding: 32px 20px 20px 20px; border-bottom: 1px solid #f1f5f9; text-align: center;">
                  <img src="cid:orvion-logo" alt="Orvion Logo" width="220" style="display: inline-block; border: 0; outline: none; text-decoration: none;" />
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding: 40px 40px 32px 40px;">
                  <h2 style="color: #0f172a; font-size: 22px; font-weight: 800; margin: 0 0 16px 0; text-align: center;">Purchase Confirmed! 🎉</h2>
                  <p style="color: #475569; font-size: 15px; line-height: 24px; margin: 0 0 24px 0;">
                    Hello <strong>${studentName}</strong>,
                  </p>
                  <p style="color: #475569; font-size: 15px; line-height: 24px; margin: 0 0 24px 0;">
                    Thank you for enrolling in/registering for <strong>${itemTitle}</strong>. We have successfully processed your payment of <strong>INR ${amount}</strong> via Razorpay.
                  </p>
                  <p style="color: #475569; font-size: 15px; line-height: 24px; margin: 0 0 24px 0;">
                    You can now access your dashboard. Happy learning!
                  </p>
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/student/dashboard" style="background-color: #b45309; color: #ffffff; padding: 12px 30px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block;">Go to Student Dashboard</a>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #fafaf9; padding: 24px 40px; text-align: center; border-top: 1px solid #f1f5f9;">
                  <p style="color: #a8a29e; font-size: 11px; margin: 0 0 6px 0; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">
                    Orvion Learn
                  </p>
                  <p style="color: #d6d3d1; font-size: 11px; margin: 0;">
                    Unlock The Future • Secure Telemetry Enabled
                  </p>
                </td>
              </tr>

            </table>
          </div>
        `,
        attachments: [
          {
            filename: 'logo.png',
            path: logoPath,
            cid: 'orvion-logo'
          }
        ]
      };

      await Promise.race([
        transporter.sendMail(mailOptions),
        new Promise((_, reject) => setTimeout(() => reject(new Error('SMTP Timeout')), 15000)),
      ]);
      console.log(`[EmailService] Purchase confirmation email sent successfully to ${toEmail}`);
    } catch (err) {
      console.warn(`[EmailService Warning]: Could not send purchase confirmation email via SMTP (${err.message})`);
    }
  }

  async sendResetOTP(toEmail, otpCode) {
    console.log(`[EmailService] Password Reset OTP generated for ${toEmail}: >>> ${otpCode} <<<`);

    if (!process.env.SMTP_USER) {
      console.log(`[EmailService] SMTP_USER not set. Reset OTP logged to console.`);
      return;
    }

    try {
      const transporter = createTransporter();
      const logoPath = path.join(__dirname, '../../frontend/public/logo.png');

      const mailOptions = {
        from: process.env.EMAIL_FROM || `"Orvion Learn" <${process.env.SMTP_USER}>`,
        to: toEmail,
        subject: 'Reset Your Password - Orvion Learn',
        text: `Please use the following 6-digit security code to verify your identity and reset your account password: ${otpCode}. This code is valid for 10 minutes.`,
        html: `
          <div style="background-color: #f8fafc; padding: 40px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; width: 100%; margin: 0; text-align: center;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 550px; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); border: 1px solid #f1f5f9; margin: 0 auto; text-align: left; border-collapse: collapse;">
              
              <!-- Header with Logo -->
              <tr>
                <td align="center" style="background-color: #ffffff; padding: 32px 20px 20px 20px; border-bottom: 1px solid #f1f5f9; text-align: center;">
                  <img src="cid:orvion-logo" alt="Orvion Logo" width="220" style="display: inline-block; border: 0; outline: none; text-decoration: none;" />
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding: 40px 40px 32px 40px; text-align: center;">
                  <h2 style="color: #0f172a; font-size: 22px; font-weight: 800; margin: 0 0 16px 0;">Reset Your Password</h2>
                  <p style="color: #475569; font-size: 15px; line-height: 24px; margin: 0 0 24px 0;">
                    Please use the following 6-digit security code to verify your identity and reset your account password.
                  </p>

                  <!-- Code Block -->
                  <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 30px auto;">
                    <tr>
                      <td align="center" style="background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); padding: 18px 40px; border-radius: 20px; border: 1px dashed #cbd5e1;">
                        <span style="font-family: 'Courier New', Courier, monospace; font-size: 38px; font-weight: 800; letter-spacing: 8px; color: #b45309; display: block; margin: 0; line-height: 1; padding-left: 8px;">
                          ${otpCode}
                        </span>
                      </td>
                    </tr>
                  </table>

                  <p style="color: #64748b; font-size: 13px; line-height: 20px; margin: 0;">
                    This password reset link and code is valid for <strong>10 minutes</strong>. If you did not request this, please ignore this email.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #fafaf9; padding: 24px 40px; text-align: center; border-top: 1px solid #f1f5f9;">
                  <p style="color: #a8a29e; font-size: 11px; margin: 0 0 6px 0; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">
                    Orvion Learn
                  </p>
                  <p style="color: #d6d3d1; font-size: 11px; margin: 0;">
                    Unlock The Future • Secure Telemetry Enabled
                  </p>
                </td>
              </tr>

            </table>
          </div>
        `,
        attachments: [
          {
            filename: 'logo.png',
            path: logoPath,
            cid: 'orvion-logo'
          }
        ]
      };

      await Promise.race([
        transporter.sendMail(mailOptions),
        new Promise((_, reject) => setTimeout(() => reject(new Error('SMTP Timeout')), 15000)),
      ]);
      console.log(`[EmailService] Reset OTP email sent successfully to ${toEmail}`);
    } catch (err) {
      console.warn(`[EmailService Warning]: Could not send reset OTP email via SMTP (${err.message})`);
    }
  }
}

module.exports = new EmailService();
