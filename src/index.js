const sendContactFormEmail = require('./handlers/contact_form');

const ALLOWED_ORIGINS = ['https://bigdevdog.com', 'https://www.bigdevdog.com'];
const ALLOWED_METHODS = ['OPTIONS', 'POST'];
const ALLOWED_HEADERS = ['Content-Type'];

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGINS,
  'Access-Control-Allow-Methods': ALLOWED_METHODS,
  'Access-Control-Allow-Headers': ALLOWED_HEADERS
};

// TODO: deal ONLY with routes and handlers here. Move handlers for specific
// routes to separate files. Move the email-specific functionality separate to
// that.

exports.handler = async (event) => {
  const { routeKey, body, headers } = event;
  const [method, path] = routeKey.split(' ');
  console.log({ method, path });
  console.log({ headers });
  if (path === '/contact') {
    if (method === 'OPTIONS') {
      const originAllowed = ALLOWED_ORIGINS.includes(headers.origin);
      return {
        statusCode: originAllowed ? 204 : 403,
        headers: CORS_HEADERS,
        body: ''
      };
    }

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
        headers: CORS_HEADERS,
        body: JSON.stringify(info)
      };
    }
  }
};
