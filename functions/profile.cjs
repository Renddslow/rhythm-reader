const fauna = require('faunadb');
const cookie = require('cookie');
const { to } = require('await-to-js');
const jwt = require('jsonwebtoken');

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

  const completions = await client.query(
    q.Map(
      q.Paginate(q.Match(q.Index('completion-user'), userRef), {
        size: 150,
      }),
      q.Lambda('x', q.Get(q.Var('x'))),
    ),
  );

  const links = await client.query(
    q.Map(
      q.Paginate(q.Match(q.Index('link-user'), userRef), {
        size: 150,
      }),
      q.Lambda('x', q.Get(q.Var('x'))),
    ),
  );

  response.body = JSON.stringify({
    ...user.data,
    links: links.data.map(({ data }) => data),
    completions: completions.data.map(({ data }) => data),
  });

  return response;
};

exports.handler = handler;
