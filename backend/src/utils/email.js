const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false, // TLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

/**
 * Send a single email
 */
const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = createTransporter();
  const info = await transporter.sendMail({
    from: `"TaxonTime.Ng" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text,
    html,
  });
  return info;
};

/**
 * Send newsletter to a list of subscribers
 */
const sendNewsletter = async ({ subscribers, subject, body }) => {
  const transporter = createTransporter();
  const results = { success: 0, failed: 0 };

  for (const subscriber of subscribers) {
    try {
      const unsubscribeUrl = `${process.env.FRONTEND_URL}/unsubscribe?token=${subscriber.unsubscribeToken}`;
      await transporter.sendMail({
        from: `"TaxonTime.Ng" <${process.env.SMTP_USER}>`,
        to: subscriber.email,
        subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <div style="background: #000; padding: 24px; text-align: center;">
              <h1 style="color: #fff; margin: 0; font-size: 24px;">
                TaxonTime<span style="color: #16A34A;">.Ng</span>
              </h1>
            </div>
            <div style="padding: 32px 24px; background: #fff;">
              ${body}
            </div>
            <div style="background: #f5f5f5; padding: 16px; text-align: center; font-size: 12px; color: #888;">
              <p>You are receiving this because you subscribed to TaxonTime.Ng newsletters.</p>
              <p><a href="${unsubscribeUrl}" style="color: #16A34A;">Unsubscribe</a></p>
            </div>
          </div>
        `,
      });
      results.success++;
    } catch (err) {
      console.error(`Failed to send to ${subscriber.email}:`, err.message);
      results.failed++;
    }
  }

  return results;
};

/**
 * Send contact form notification to admin
 */
const sendContactNotification = async ({ name, email, phone, service, message }) => {
  await sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject: `New Contact Form Submission — ${service}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #000; padding: 20px; text-align: center;">
          <h1 style="color: #fff; margin: 0;">TaxonTime<span style="color: #16A34A;">.Ng</span></h1>
        </div>
        <div style="padding: 24px; background: #fff; border: 1px solid #e5e5e5;">
          <h2 style="color: #000;">New Contact Form Submission</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; font-weight: bold; width: 120px;">Name:</td><td style="padding: 8px;">${name}</td></tr>
            <tr style="background:#f9f9f9"><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;">${email}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Phone:</td><td style="padding: 8px;">${phone || 'Not provided'}</td></tr>
            <tr style="background:#f9f9f9"><td style="padding: 8px; font-weight: bold;">Service:</td><td style="padding: 8px;">${service}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold; vertical-align: top;">Message:</td><td style="padding: 8px;">${message}</td></tr>
          </table>
        </div>
      </div>
    `,
  });
};

/**
 * Send confirmation email to contact form submitter
 */
const sendContactConfirmation = async ({ name, email }) => {
  await sendEmail({
    to: email,
    subject: 'We received your message — TaxonTime.Ng',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #000; padding: 20px; text-align: center;">
          <h1 style="color: #fff; margin: 0;">TaxonTime<span style="color: #16A34A;">.Ng</span></h1>
        </div>
        <div style="padding: 32px 24px; background: #fff; border: 1px solid #e5e5e5;">
          <h2 style="color: #000;">Hi ${name},</h2>
          <p>Thank you for reaching out to us! We have received your message and will get back to you within <strong>24–48 hours</strong>.</p>
          <p>In the meantime, feel free to explore our <a href="${process.env.FRONTEND_URL}/services" style="color: #16A34A;">services</a> or read our latest <a href="${process.env.FRONTEND_URL}/blog" style="color: #16A34A;">tax tips</a>.</p>
          <p style="margin-top: 32px;">Warm regards,<br><strong>Zarat Ranti L.</strong><br>TaxonTime.Ng</p>
        </div>
      </div>
    `,
  });
};

module.exports = {
  sendEmail,
  sendNewsletter,
  sendContactNotification,
  sendContactConfirmation,
};
