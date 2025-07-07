const sendContactFormEmail = require('./handlers/contact_form');

exports.handler = async (event) => {
  const { httpMethod, path, body } = event;
  const parsedBody = JSON.parse(body);
  if (httpMethod === 'POST') {
    // They want to send an email.

    if (path === '/contact') {
      // They want to send an email from the contact form at
      // https://www.bigdevdog.com/contact.
      const { name, email, phone, header, message } = parsedBody;
      const result = await sendContactFormEmail(
        name,
        email,
        phone,
        header,
        message
      );
      return {
        statusCode: 200,
        body: JSON.stringify({
          result
        })
      };
    }
  }
};
