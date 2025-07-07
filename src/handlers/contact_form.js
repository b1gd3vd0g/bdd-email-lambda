const transporter = require('../transporter');
const fs = require('fs');

async function sendContactFormEmail(name, email, phone, header, message) {
  const fillInTemplate = (template) => {
    return template
      .replace(/~~NAME~~/g, name)
      .replace(/~~EMAIL~~/g, email)
      .replace(/~~PHONE~~/g, phone)
      .replace(/~~HEADER~~/g, header)
      .replace(/~~MESSAGE~~/g, message);
  };
  const pathPrefix = 'src/templates/cf_message';
  const htmlTemplate = fs.readFileSync(`${pathPrefix}.html`).toString();
  const txtTemplate = fs.readFileSync(`${pathPrefix}.txt`).toString();
  const html = fillInTemplate(htmlTemplate);
  const txt = fillInTemplate(txtTemplate);

  const info = await transporter.sendMail({
    from: '"Big Dev Dog Automailer" <automailer@bigdevdog.com>',
    to: 'devin@bigdevdog.com',
    subject: `${name} wants to get in touch!`,
    text: txt,
    html: html
  });

  return info;
}

module.exports = sendContactFormEmail;
