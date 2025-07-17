const path = require('path');
const fs = require('fs');
const transporter = require('./transporter');
const { ApiResponse } = require('../util/api_response');

/**
 * Attempt to send an email to Devin (`devin@bigdevdog.com`) containing the
 * following information:
 * @param {string} name The name of the sender.
 * @param {string} email The email address of the sender.
 * @param {string} phone The phone number of the sender.
 * @param {string} header The header/subject line of the message.
 * @param {string} message The body of the message.
 * @return {ApiResponse}
 */
exports.sendContactFormEmail = async function (
  name,
  email,
  phone,
  header,
  message
) {
  /** Fill in a template with the proper data. */
  function fillInTemplate(template) {
    return template
      .replace(/~~NAME~~/g, name)
      .replace(/~~EMAIL~~/g, email)
      .replace(/~~PHONE~~/g, phone)
      .replace(/~~HEADER~~/g, header)
      .replace(/~~MESSAGE~~/g, message);
  }

  const templatePath = path.join(__dirname, '../cf_message');
  const htmlTemplate = fs.readFileSync(`${templatePath}.html`).toString();
  const txtTemplate = fs.readFileSync(`${templatePath}.txt`).toString();
  const html = fillInTemplate(htmlTemplate);
  const text = fillInTemplate(txtTemplate);

  try {
    const response = await transporter.sendMail({
      html,
      text,
      from: '"Big Dev Dog Automailer" <automailer@bigdevdog.com>',
      to: 'devin@bigdevdog.com',
      subject: `${name} wants to get in touch!`
    });

    if (response.accepted.length) {
      return new ApiResponse(
        200,
        'Your message has been sent successfully. Please allow up to two days for a response.'
      );
    } else {
      return new ApiResponse(
        500,
        'Something went wrong, and Devin could not receive your message.',
        { info: response }
      );
    }
  } catch (error) {
    return new ApiResponse(
      500,
      'Your message could not be sent. Try again later.',
      { error }
    );
  }
};
