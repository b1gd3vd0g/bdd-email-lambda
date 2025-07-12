const { SMTP_HOST, EMAIL_PASSWORD } = process.env;

if (!(SMTP_HOST && EMAIL_PASSWORD)) {
  console.log('Environment is not configured to create SMTP transporter.');
}

const transporter = require('nodemailer').createTransport({
  host: SMTP_HOST,
  port: 465,
  secure: true,
  auth: {
    user: 'automailer@bigdevdog.com',
    pass: EMAIL_PASSWORD
  }
});

module.exports = transporter;
