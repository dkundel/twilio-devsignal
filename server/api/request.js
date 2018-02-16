import uuid from 'uuid/v4';
import { stripIndents } from 'common-tags';

import {
  EVENT_CODES,
  TWILIO_ACCOUNT_SID,
  TWILIO_API_KEY,
  TWILIO_API_SECRET,
  TWILIO_CHAT_SERVICE_SID,
  SLACK_TOKEN,
  BOT_CHANNEL,
  USER_ID_TO_MENTION
} from '../config';
import {
  createInitialMessage,
  sendMessageWithOptions
} from '../services/slack';
import {
  createChannel,
  generateTokenFor,
  sendMessageToChannel
} from '../services/chat';
import { createNewSession } from '../services/data';

export default async function handleRequest(req, res, next) {
  const {
    message,
    lang,
    username: name,
    product,
    accountSid,
    eventCode
  } = req.body;

  if (!EVENT_CODES.includes(eventCode.toUpperCase())) {
    res.status(403).send('Invalid Event Code');
    return;
  }

  if (!message) {
    res.status(400).send('Please enter a message');
    return;
  }

  if (!lang) {
    res
      .status(400)
      .send(
        'Please pick a programming language or Other. It helps us to help you quicker.'
      );
    return;
  }

  if (!name) {
    res
      .status(400)
      .send('Please enter a name :) It makes the conversation nicer!');
    return;
  }

  if (!product) {
    res
      .status(400)
      .send('Please specify your Account SID. It helps us help you quicker.');
    return;
  }

  const sessionId = uuid();
  const channelId = BOT_CHANNEL;

  const info = {
    message,
    lang,
    name,
    product,
    accountSid,
    sessionId,
    eventCode
  };

  const opts = createInitialMessage(info);

  try {
    const identity = await createChannel(accountSid, sessionId, name);
    await sendMessageToChannel(message, sessionId, identity);
    info.identity = identity;
    const messageContent = stripIndents`
      Fast someone needs your help <${USER_ID_TO_MENTION}> team! Anyone up for the challenge?

      You can reply inline inside this thread or by clicking the 'Open Chat' button.
    `;
    const msg = await sendMessageWithOptions(channelId, messageContent, opts);
    await createNewSession(sessionId, msg.ts, info);
    const token = generateTokenFor(identity);
    res.send({ token, channelName: sessionId });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal error');
  }
}
