/**
 * Run this locally to verify your SMTP credentials work:
 *   node scripts/test-email.js
 */

require('dotenv').config();
const nodemailer = require('nodemailer');

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO } = process.env;

if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
  console.error('❌  Missing SMTP env vars in .env — check SMTP_HOST, SMTP_USER, SMTP_PASS');
  process.exit(1);
}

console.log(`\n📧  Testing SMTP connection...`);
console.log(`    Host : ${SMTP_HOST}:${SMTP_PORT || 587}`);
console.log(`    From : ${SMTP_USER}`);
console.log(`    To   : ${CONTACT_TO || 'info@insulara.com'}\n`);

const transporter = nodemailer.createTransport({
  host:   SMTP_HOST,
  port:   parseInt(SMTP_PORT) || 587,
  secure: parseInt(SMTP_PORT) === 465,
  auth:   { user: SMTP_USER, pass: SMTP_PASS },
});

transporter.verify()
  .then(() => {
    console.log('✅  SMTP connection verified! Sending test email...');
    return transporter.sendMail({
      from:    `"Insulara Test" <${SMTP_USER}>`,
      to:       CONTACT_TO || 'info@insulara.com',
      subject: '✅ Insulara — Contact Form Test',
      html: `
        <div style="font-family:sans-serif;padding:24px;">
          <h2 style="color:#0A4DA2;">SMTP is working!</h2>
          <p>This is a test email from your Insulara contact form setup.</p>
          <p>If you received this, the contact form will deliver real submissions correctly.</p>
        </div>
      `,
    });
  })
  .then(info => {
    console.log('✅  Test email sent!  Message ID:', info.messageId);
    console.log('    Check your inbox at', CONTACT_TO || 'info@insulara.com');
  })
  .catch(err => {
    console.error('❌  SMTP Error:', err.message);
    if (err.message.includes('535') || err.message.includes('auth')) {
      console.error('    → Wrong username or password');
    } else if (err.message.includes('ECONNREFUSED') || err.message.includes('ETIMEDOUT')) {
      console.error('    → Cannot reach SMTP server — check SMTP_HOST and SMTP_PORT');
    }
  });
