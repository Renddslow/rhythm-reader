const fauna = require('faunadb');
const { to } = require('await-to-js');
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');

const q = fauna.query;
const client = new fauna.Client({
  secret: process.env.FAUNA_KEY || '',
  domain: 'db.fauna.com',
  scheme: 'https',
});

const EMAIL_TOKEN = process.env.EMAIL_TOKEN;
sgMail.setApiKey(process.env.SENDGRID_KEY);

const emailBody = (token, firstName, lastName, email) => `<!DOCTYPE html>
<html lang="en-US">
   <head>
      <style>
         p {
         margin-bottom: 12px;
         }
         .copy-link {
         margin-top: 24px;
         }
         .cta {
         padding: 12px 24px;
         box-sizing: border-box;
         font-size: 16px;
         appearance: none;
         -webkit-appearance: none;
         border: none;
         border-radius: 8px;
         background: #53917E;
         font-weight: 600;
         display: block;
         max-width: max-content;
         text-decoration: none;
         line-height: 1.2;
         color: #f9fffd !important;
         border: 0;
         cursor: pointer;
         }
      </style>
   </head>
   <body>
      <p>Hey there, ${firstName}!</p>
      <p>
         Thank you so much for reading the Scriptures as we exlore the theme of sacred rhythms this series. I'm so excited for what you'll discover as you move slowly and thoughtfully through the Bible.
      </p>
      <p>Below is your magic link. Just click it and you'll be logged in!</p>
      <a
         href="https://rhythm.flatland.church/auth?token=${token}"
         class="cta"
         >✨ Your Magic Link ✨</a>
      <div class="copy-link">
         <p>
            If you have trouble with the button, copy and paste the link below into your browser bar:
         </p>
         <p>
            https://rhythm.flatland.church/auth?token=${token}
         </p>
      </div>
      <footer style="text-align: center; margin-top: 24px">
         <div style="font-size: 12px; color: #434443">
            <p style="margin-bottom: 0">
               This system email was sent to ${firstName} ${lastName} (${email}) regarding your
               rhythm.flatland.church account
            </p>
            <p>by Flatland Group, 501(c)3 47-0795919, 4801 N 144th Street, Omaha, NE 68116</p>
         </div>
         <p style="color: #434443">
            If you have any questions, simply respond to this email and we'll be happy to help.
         </p>
      </footer>
   </body>
</html>
`;

const handler = async (event) => {
  if (event.httpMethod !== 'POST') return Promise.resolve({ statusCode: 405 });

  const { firstName, lastName, email } = JSON.parse(event.body);

  const [err, user] = await to(client.query(q.Get(q.Match(q.Index('emails'), email))));

  if (err && !(firstName || lastName)) {
    return Promise.resolve({
      statusCode: 400,
    });
  }

  const tokenPayload = {
    id: user && user.ref.toJSON()['@ref'].id,
  };

  if (err && firstName && lastName) {
    const payload = {
      firstName,
      lastName,
      email,
      created: new Date().toISOString(),
    };

    const [, user] = await to(client.query(q.Create(q.Collection('users'), { data: payload })));
    tokenPayload.id = user && user.ref.toJSON()['@ref'].id;

    console.log(`Created new user with email address: ${email}`);
  }

  const token = await jwt.sign(tokenPayload, EMAIL_TOKEN);

  await sgMail
    .send({
      html: emailBody(
        token,
        user?.data?.firstName || firstName,
        user?.data?.lastName || lastName,
        email,
      ),
      to: email,
      from: {
        email: 'no-reply@flatland.church',
        name: 'Matt at Flatland',
      },
      replyTo: {
        email: 'mubatt@wyopub.com',
        name: 'Matt McElwee',
      },
      subject: `${user?.data?.firstName || firstName}, Your magic link for the Rhythm Reader`,
    })
    .catch((e) => {
      console.log(e);
    });

  return Promise.resolve({ statusCode: 200 });
};

exports.handler = handler;
