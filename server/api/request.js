import { WebClient } from '@slack/client';
import kebabCase from 'lodash/kebabCase';
import Twilio from 'twilio';
import uuid from 'uuid/v4';

import {
  TWILIO_ACCOUNT_SID,
  TWILIO_API_KEY,
  TWILIO_API_SECRET,
  TWILIO_CHAT_SERVICE_SID,
  SLACK_TOKEN,
  BOT_CHANNEL
} from '../config';

const slackClient = new WebClient(SLACK_TOKEN);
const twilioClient = new Twilio(TWILIO_API_KEY, TWILIO_API_SECRET, {
  accountSid: TWILIO_ACCOUNT_SID
});

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

export async function prepareChat(accountSid, sessionId, name) {
  const chatService = twilioClient.chat.services(TWILIO_CHAT_SERVICE_SID);
  const user = await chatService.users.create({
    identity: `${accountSid}:${kebabCase(name)}`,
    friendlyName: name
  });

  let channel;
  try {
    channel = await chatService.channels.create({
      friendlyName: `Chat for ${name}`,
      type: 'private',
      uniqueName: sessionId
    });
  } catch (err) {
    channel = await chatService.channels(sessionId).fetch();
  }

  await chatService.channels(channel.sid).members.create({
    identity: user.identity
  });

  return user;
}

export default async function handleRequest(req, res, next) {
  const { message, lang, name, product } = req.body;
  const accountSid = 'ACxxxxxxxxxxxxxxx';
  const sessionId = uuid();
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
    await prepareChat(accountSid, sessionId, name);
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
