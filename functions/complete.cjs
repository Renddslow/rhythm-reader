const fauna = require('faunadb');
const { to } = require('await-to-js');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');

const CLIENT_SECRET = process.env.COOKIE_TOKEN || '';

const q = fauna.query;
const client = new fauna.Client({
  secret: process.env.FAUNA_KEY || '',
  domain: 'db.fauna.com',
  scheme: 'https',
});

const safelyVerify = (token) => {
  try {
    return jwt.verify(token, CLIENT_SECRET);
  } catch (e) {
    return null;
  }
};

const handler = async (event) => {
  const { cookie: cookies } = event.headers;
  const { movement, page } = JSON.parse(event.body);

  const response = {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
      'Content-Type': 'application/json',
    },
    statusCode: 200,
  };

  if (!cookies) {
    response.statusCode = 401;
    return Promise.resolve(response);
  }

  const token = cookie.parse(cookies)['rhythm-token'];
  const tokenPayload = safelyVerify(token);

  if (!tokenPayload) {
    response.statusCode = 401;
    return Promise.resolve(response);
  }

  const { id } = tokenPayload;
  const [, user] = await to(client.query(q.Get(q.Ref(q.Collection('users'), id))));
  const userRef = user.ref.toJSON()['@ref'].id;

  const payload = {
    user: userRef,
    read_at: new Date().toISOString(),
    movement,
    page,
  };

  await client.query(q.Create(q.Collection('completions'), { data: payload }));

  response.body = JSON.stringify(payload);

  return Promise.resolve(response);
};

exports.handler = handler;
