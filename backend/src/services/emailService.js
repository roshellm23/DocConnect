const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailService {
  /**
   * Initialize transporter
   * If EMAIL_USER & EMAIL_PASS are set, use Gmail SMTP.
   * Otherwise, use a simulated transporter that logs output without crashing.
   */
  static getTransporter() {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (user && pass) {
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user,
          pass, // 16-character Gmail App Password
        },
      });
    }

    // Return null to indicate simulated mode
    return null;
  }

  /**
   * Generic sender with HTML template wrapper
   */
  static async sendMail({ to, subject, htmlText, fallbackText }) {
    const transporter = EmailService.getTransporter();
    const fromAddress = process.env.EMAIL_FROM || process.env.EMAIL_USER || 'DocConnect Healthcare <notifications@docconnect.com>';

    if (!transporter) {
      console.log(`\n======================================================`);
      console.log(`📧 [EMAIL SERVICE SIMULATION] (Add EMAIL_USER & EMAIL_PASS in .env for real Gmail delivery)`);
      console.log(`   To:       ${to}`);
      console.log(`   Subject:  ${subject}`);
      console.log(`   Time:     ${new Date().toLocaleString()}`);
      console.log(`   Content:  ${fallbackText || subject}`);
      console.log(`======================================================\n`);
      return { simulated: true, to, subject };
    }

    try {
      const info = await transporter.sendMail({
        from: fromAddress,
        to,
        subject,
        text: fallbackText,
        html: htmlText,
      });
      console.log(`[EmailService] Dispatched "${subject}" to ${to} (Message ID: ${info.messageId})`);
      return info;
    } catch (error) {
      console.error(`[EmailService] Failed to send email to ${to}:`, error.message);
      // Do not throw: emails should be non-blocking for core user workflows
      return null;
    }
  }

  /**
   * 1. Send Welcome Email on Signup
   */
  static async sendWelcomeEmail(user) {
    const subject = 'Welcome to DocConnect Healthcare Platform';
    const fallbackText = `Hello ${user.full_name}, welcome to DocConnect! Your patient account (${user.email}) is active.`;
    
    const htmlText = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc; border-radius: 12px; color: #1e293b;">
        <div style="background: linear-gradient(135deg, #0d9488 0%, #0284c7 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 26px; font-weight: 800;">DocConnect</h1>
          <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.9;">HEALTHCARE & SPECIALIST CONSULTATION PORTAL</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e2e8f0; border-top: none;">
          <h2 style="color: #0f172a; font-size: 20px; margin-top: 0;">Welcome to DocConnect, ${user.full_name}!</h2>
          <p style="color: #475569; font-size: 15px; line-height: 1.6;">
            Your patient account has been successfully registered and verified. You can now browse our roster of certified physicians, schedule medical consultations in real-time, and manage your health records seamlessly.
          </p>

          <div style="background-color: #f0fdfa; border: 1px solid #99f6e4; border-radius: 8px; padding: 16px; margin: 24px 0;">
            <div style="font-size: 13px; color: #0f766e; font-weight: 700; text-transform: uppercase;">Your Account Summary</div>
            <div style="font-size: 15px; color: #134e4a; font-weight: 600; margin-top: 6px;">
              Email: <strong>${user.email}</strong><br/>
              Role: <strong>${user.role || 'patient'}</strong><br/>
              Status: <strong style="color: #16a34a;">Active & Verified</strong>
            </div>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:5173/book" style="display: inline-block; background-color: #0284c7; color: #ffffff; font-weight: 700; font-size: 15px; text-decoration: none; padding: 12px 28px; border-radius: 8px;">
              Book Your First Appointment →
            </a>
          </div>

          <p style="font-size: 13px; color: #94a3b8; line-height: 1.5; margin-top: 30px; border-top: 1px solid #f1f5f9; padding-top: 20px;">
            If you did not register for this account, please ignore this email or contact support. DocConnect never asks for your password via email.
          </p>
        </div>
      </div>
    `;

    return EmailService.sendMail({ to: user.email, subject, htmlText, fallbackText });
  }

  /**
   * 2. Send Security Login Alert Email
   */
  static async sendLoginAlertEmail(user, meta = {}) {
    const timestamp = new Date().toLocaleString('en-US', { timeZoneName: 'short' });
    const subject = 'Security Notice: New Sign-in to DocConnect';
    const fallbackText = `Hello ${user.full_name}, a new sign-in was detected on your DocConnect account (${user.email}) at ${timestamp}.`;

    const htmlText = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc; border-radius: 12px; color: #1e293b;">
        <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; border: 1px solid #e2e8f0;">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
            <div style="width: 40px; height: 40px; border-radius: 8px; background: #e0f2fe; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #0284c7; font-size: 18px;">
              DC
            </div>
            <div>
              <h2 style="margin: 0; font-size: 18px; color: #0f172a;">DocConnect Security Notification</h2>
              <span style="font-size: 12px; color: #64748b;">ACCOUNT SECURITY TELEMETRY</span>
            </div>
          </div>

          <p style="color: #334155; font-size: 15px; line-height: 1.5;">
            Hello <strong>${user.full_name}</strong>,
          </p>
          <p style="color: #475569; font-size: 14px; line-height: 1.6;">
            A new successful sign-in session was recorded for your DocConnect account:
          </p>

          <div style="background-color: #f8fafc; border-left: 4px solid #0284c7; padding: 14px 18px; margin: 20px 0; font-size: 14px; color: #334155;">
            <strong>Timestamp:</strong> ${timestamp}<br/>
            <strong>Account:</strong> ${user.email}<br/>
            <strong>Access Role:</strong> ${user.role || 'patient'}
          </div>

          <p style="color: #64748b; font-size: 13px; line-height: 1.5;">
            If this was you, no action is needed. If you did not sign in recently, please secure your account immediately by changing your password.
          </p>
        </div>
      </div>
    `;

    return EmailService.sendMail({ to: user.email, subject, htmlText, fallbackText });
  }

  /**
   * 3. Send Appointment Confirmation Email on Booking
   */
  static async sendAppointmentConfirmationEmail(user, appointment) {
    const subject = `Appointment Confirmed: ${appointment.doctor_name} (Ref #${appointment.id})`;
    const fallbackText = `Hello ${user.full_name || appointment.patient_name}, your consultation with ${appointment.doctor_name} is scheduled for ${appointment.appointment_date} at ${appointment.appointment_time}.`;

    const htmlText = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc; border-radius: 12px; color: #1e293b;">
        <div style="background: linear-gradient(135deg, #0d9488 0%, #0284c7 100%); padding: 26px; border-radius: 10px 10px 0 0; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 22px; font-weight: 800;">Appointment Confirmation</h1>
          <p style="margin: 6px 0 0 0; font-size: 13px; opacity: 0.9;">REF #${appointment.id} • POSTGRESQL VERIFIED</p>
        </div>

        <div style="background-color: #ffffff; padding: 28px; border-radius: 0 0 10px 10px; border: 1px solid #e2e8f0; border-top: none;">
          <p style="color: #334155; font-size: 15px; margin-top: 0;">
            Dear <strong>${user.full_name || appointment.patient_name}</strong>,
          </p>
          <p style="color: #475569; font-size: 14px; line-height: 1.6;">
            Your healthcare consultation has been confirmed and scheduled with the clinical specialist below:
          </p>

          <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b;">Specialist:</td>
              <td style="padding: 10px 0; font-weight: 700; color: #0f172a; text-align: right;">${appointment.doctor_name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b;">Consultation Date:</td>
              <td style="padding: 10px 0; font-weight: 700; color: #0f172a; text-align: right;">${appointment.appointment_date}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b;">Scheduled Time Slot:</td>
              <td style="padding: 10px 0; font-weight: 700; color: #0284c7; text-align: right;">${appointment.appointment_time}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b;">Consultation Status:</td>
              <td style="padding: 10px 0; font-weight: 700; color: #16a34a; text-align: right; text-transform: uppercase;">Scheduled</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #64748b;">Clinical Reason:</td>
              <td style="padding: 10px 0; color: #334155; text-align: right; font-style: italic;">"${appointment.reason}"</td>
            </tr>
          </table>

          <div style="text-align: center; margin: 28px 0 16px;">
            <a href="http://localhost:5173/appointments/${appointment.id}" style="display: inline-block; background-color: #0d9488; color: #ffffff; font-weight: 700; font-size: 14px; text-decoration: none; padding: 11px 24px; border-radius: 8px;">
              View Appointment Details →
            </a>
          </div>

          <p style="font-size: 12px; color: #94a3b8; text-align: center; margin-top: 24px;">
            DocConnect Healthcare Platform • Please arrive 10 minutes prior to your scheduled consultation slot.
          </p>
        </div>
      </div>
    `;

    return EmailService.sendMail({ to: user.email || appointment.patient_email, subject, htmlText, fallbackText });
  }
}

module.exports = EmailService;
