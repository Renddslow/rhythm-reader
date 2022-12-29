const jwt = require('jsonwebtoken');
const cookie = require('cookie');

const EMAIL_SECRET = process.env.EMAIL_TOKEN;
const COOKIE_SECRET = process.env.COOKIE_TOKEN;

const safelyVerify = (token) => {
  try {
    return jwt.verify(token, EMAIL_SECRET);
  } catch (e) {
    return null;
  }
};

const handler = async (event) => {
  const { token } = event.queryStringParameters;

  const verified = await safelyVerify(token);

  if (!verified) {
    return Promise.resolve({
      statusCode: 302,
      headers: {
        Location: '/',
      },
    });
  }

  const { id } = verified;

  const cookieToken = await jwt.sign({ id }, COOKIE_SECRET);

  return Promise.resolve({
    headers: {
      'set-cookie': cookie.serialize('rhythm-token', cookieToken, {
        maxAge: 60 * 60 * 24 * 30 * 6, // ~6 months
        httpOnly: true,
      }),
      Location: '/',
    },
    statusCode: 302,
  });
};

exports.handler = handler;
