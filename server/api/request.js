import uuid from 'uuid/v4';

import {
  EVENT_CODES,
  TWILIO_ACCOUNT_SID,
  TWILIO_API_KEY,
  TWILIO_API_SECRET,
  TWILIO_CHAT_SERVICE_SID,
  SLACK_TOKEN,
  BOT_CHANNEL
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
    const msg = await sendMessageWithOptions(
      channelId,
      `Fast someone needs your help! Anyone up for the challenge? \n You can reply inline in this thread or by opening clicking the 'Open Chat' button.`,
      opts
    );
    await createNewSession(sessionId, msg.ts, info);
    const token = generateTokenFor(identity);
    res.send({ token, channelName: sessionId });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal error');
  }
}
