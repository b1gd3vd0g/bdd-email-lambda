const { sendContactFormEmail } = require('./mail/contact_sender');

const HEADERS = {
  'Content-Type': 'application/json'
};

// TODO: deal ONLY with routes and handlers here. Move handlers for specific
// routes to separate files. Move the email-specific functionality separate to
// that.

exports.handler = async (event) => {
  const { routeKey, body } = event;
  const [method, path] = routeKey.split(' ');

  if (path === '/contact') {
    if (method === 'POST') {
      const parsedBody = JSON.parse(body);
      const { name, email, phone, header, message } = parsedBody;
      const { status, info } = await sendContactFormEmail(
        name,
        email,
        phone,
        header,
        message
      );
      return {
        statusCode: status,
        headers: HEADERS,
        body: JSON.stringify(info)
      };
    }
  }
};
