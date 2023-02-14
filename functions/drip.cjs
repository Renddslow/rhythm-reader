const { google } = require('googleapis');
const { isSameDay } = require('date-fns');
const got = require('got');
const { to } = require('await-to-js');
const fauna = require('faunadb');
const sgMail = require('@sendgrid/mail');
const snarkdown = require('snarkdown');

const SHEETS_SERVICE_ACCOUNT = process.env.SHEETS_SERVICE_ACCOUNT;
const PCO_APP_ID = process.env.PCO_APP_ID;
const PCO_SECRET = process.env.PCO_SECRET;
sgMail.setApiKey(process.env.SENDGRID_KEY);

const q = fauna.query;
const client = new fauna.Client({
  secret: process.env.FAUNA_KEY || '',
  domain: 'db.fauna.com',
  scheme: 'https',
});

const createMessage = ({ firstName, lastName, email, body }) => {
  return `<html lang="en-US">
    <div style="max-width: 600px">
      <p>Hey ${firstName || 'Flatlander'},</p>
      ${body
        .split('\n')
        .map((line) => `<p>${snarkdown(line)}</p>`)
        .join('')}
      <div style="margin-top: 2em">
          <p>
             <small>This system email was sent to ${firstName || ''} ${
    lastName || ''
  } (${email}) because you signed up to receive reminders about <a href="https://moed.flatland.church">Seasonal Rhythms</a> throughout 2023. If you would like to unsubscribe, simply reply to this email with "unsubscribe."</small>
          </p>
          <p style="margin-top: 0"><small>by Flatland Group, 501(c)3 47-0795919, 4801 N 144th Street, Omaha, NE 68116</small></p>
           <p style="color: #434443; margin-top: 0">
              <small>If you have any questions, simply respond to this email and we'll be happy to help.</small>
           </p>
       </div>
    </div>
</html>`;
};

const createSubject = (s, f) => (f ? `${f}, ${s} | Flatland Church` : `${s} | Flatland Church`);

const getPerson = async (email) => {
  const url = `https://api.planningcenteronline.com/people/v2/people?where[search_name_or_email]=${email}`;
  const [, data] = await to(
    got(url, {
      username: PCO_APP_ID,
      password: PCO_SECRET,
    }).json(),
  );

  if (!data?.data) {
    return { email };
  }

  const [person] = data.data;

  if (!person) {
    return { email };
  }

  return {
    firstName: person.attributes.first_name,
    lastName: person.attributes.last_name,
    email,
  };
};

exports.handler = async (event, context) => {
  const sheets = google.sheets('v4');
  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(SHEETS_SERVICE_ACCOUNT),
    scopes: [
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/drive.readonly',
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/spreadsheets.readonly',
    ],
  });
  const authClient = await auth.getClient();
  const { data } = await sheets.spreadsheets.values.get({
    spreadsheetId: '1x99LV1IY2t3hS9FmOUcPeUHYBUB2EPKEVwoz2CFn0DI',
    range: 'A:D',
    auth: authClient,
  });

  const [header, ...rows] = data.values;

  const currentDrip = rows.findIndex((row) =>
    isSameDay(new Date(row[0] + 'T14:00:00.000Z'), new Date()),
  );

  if (currentDrip === -1) {
    return Promise.resolve({
      statusCode: 200,
      body: JSON.stringify({
        ts: Date.now(),
        sent: false,
        message: `No drip is currently scheduled for today.`,
      }),
    });
  }

  const drip = {
    date: rows[currentDrip][0],
    subject: rows[currentDrip][2],
    body: rows[currentDrip][3],
  };

  const emails = (
    await client.query(
      q.Map(
        q.Paginate(q.Match(q.Index('all-reminders')), {
          size: 150,
        }),
        q.Lambda('x', q.Get(q.Var('x'))),
      ),
    )
  ).data.map((d) => d.data.email);

  const people = await Promise.all(emails.map(getPerson));

  const sends = await Promise.all(
    people.map(async (person) => {
      const subject = createSubject(drip.subject, person.firstName);
      const message = createMessage({ ...person, body: drip.body });
      await sgMail
        .send({
          html: message,
          to: person.email,
          from: {
            email: 'no-reply@flatland.church',
            name: 'Matt at Flatland',
          },
          replyTo: {
            email: 'mubatt@wyopub.com',
            name: 'Matt McElwee',
          },
          subject,
        })
        .catch((e) => {
          console.log(e);
        });
    }),
  );

  return Promise.resolve({
    statusCode: 200,
    body: JSON.stringify({
      ts: Date.now(),
      message: `Drip successfully sent to ${sends.length || 'no'} recipient(s).`,
    }),
  });
};
