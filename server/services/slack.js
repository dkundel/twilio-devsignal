import { WebClient } from '@slack/client';

import { SLACK_VERIFICATION_TOKEN, SLACK_TOKEN } from '../config';

export const client = new WebClient(SLACK_TOKEN);

export async function lookUpUser(userId) {
  const { user } = await client.users.info(userId);
  const { name, profile } = user;
  const { bot_id } = profile;
  const isBot = !!bot_id;
  return { isBot, name };
}

export async function getBotId() {
  const { user_id } = await client.auth.test();
  return user_id;
}

export async function sendMessageToThread(channel, thread_ts, message) {
  return client.chat.postMessage(channel, message, {
    as_user: true,
    thread_ts
  });
}

export function createInitialMessage({
  message,
  lang,
  name,
  product,
  accountSid,
  sessionId
}) {
  const attachments = [
    {
      color: `good`,
      author_name: `${name} wrote...`,
      text: message,
      fields: [
        { title: 'Name', value: name, short: true },
        { title: 'Product', value: product, short: true },
        { title: 'Language', value: lang, short: true }
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

  return { attachments, as_user: true };
}

export async function sendMessageWithOptions(channel, message, options) {
  return client.chat.postMessage(channel, message, options);
}
