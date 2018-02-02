import { WebClient } from '@slack/client';

import { SLACK_TOKEN, BOT_CHANNEL } from '../config';

const slackClient = new WebClient(SLACK_TOKEN);

function createInitialMessage(info) {
  const { message, lang, name, product, accountSid, sessionId } = info;

  const attachments = [
    {
      color: `good`,
      author_name: `${name} wrote...`,
      text: message,
      fields: [
        {
          title: 'Name',
          value: name,
          short: true
        },
        {
          title: 'Product',
          value: product,
          short: true
        },
        {
          title: 'Language',
          value: lang,
          short: true
        }
      ],
      actions: [
        {
          style: 'primary',
          type: 'button',
          text: 'Open Chat 🗯',
          url: `http://localhost:3000/session/${sessionId}`
        },
        {
          type: 'button',
          text: 'Open Monkey Profile 🐒',
          url: `https://monkey.twilio.com/accounts/view?sid=${accountSid}`
        }
      ]
    }
  ];

  return {
    attachments,
    as_user: true
  };
}

export default async function handleRequest(req, res, next) {
  const { message, lang, name, product } = req.body;
  const accountSid = 'ACxxxxxxxxxxxxxxx';
  const sessionId = 'something-foo';
  const channelId = BOT_CHANNEL;

  const opts = createInitialMessage({
    message,
    lang,
    name,
    product,
    accountSid,
    sessionId
  });

  try {
    await slackClient.chat.postMessage(
      channelId,
      `Fast someone needs your help! Anyone up for the challenge?`,
      opts
    );
    res.send('Sent');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal error');
  }
}
