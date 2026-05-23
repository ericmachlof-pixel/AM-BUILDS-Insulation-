const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');

// Rate limiter — 5 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, error: 'Too many requests. Please try again later.' }
});

// POST /contact
router.post('/', limiter, async (req, res) => {
  const { name, email, phone, service, message, _gotcha } = req.body;

  // Honeypot check
  if (_gotcha) {
    return res.status(200).json({ success: true }); // Silently discard bots
  }

  // Validate required fields
  const errors = [];
  if (!name || name.trim().length < 2) errors.push('Name is required (min 2 chars).');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Valid email is required.');
  if (!phone || phone.trim().length < 7) errors.push('Phone number is required.');
  if (!service) errors.push('Please select a service.');
  if (!message || message.trim().length < 10) errors.push('Message must be at least 10 characters.');

  if (errors.length > 0) {
    return res.status(422).json({ success: false, errors });
  }

  // Nodemailer transport
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: parseInt(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const mailOptions = {
    from: `"Insulara Website" <${process.env.SMTP_USER}>`,
    to: process.env.CONTACT_TO || 'info@insulara.com',
    replyTo: email,
    subject: `New Inquiry — ${service} | ${name}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="background:#0A4DA2;color:#fff;padding:20px;margin:0;">New Contact Form Submission — Insulara</h2>
        <div style="padding:24px;background:#f9f9f9;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Service Requested:</strong> ${service}</p>
          <hr/>
          <p><strong>Message:</strong></p>
          <p style="white-space:pre-wrap;">${message}</p>
        </div>
        <p style="padding:16px;font-size:12px;color:#888;">Sent from insulara.com</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.json({ success: true, message: 'Your message was sent! We\'ll be in touch within 24 hours.' });
  } catch (err) {
    console.error('Mail error:', err);
    return res.status(500).json({ success: false, error: 'Failed to send message. Please call us directly.' });
  }
});

module.exports = router;
