import uuid from 'uuid/v4';

import {
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
import { createChannel } from '../services/chat';
import { createNewSession } from '../services/data';

export default async function handleRequest(req, res, next) {
  const { message, lang, name, product } = req.body;
  const accountSid = 'ACxxxxxxxxxxxxxxx';
  const sessionId = uuid();
  const channelId = BOT_CHANNEL;

  const info = { message, lang, name, product, accountSid, sessionId };

  const opts = createInitialMessage(info);

  try {
    const identity = await createChannel(accountSid, sessionId, name);
    info.identity = identity;
    const msg = await sendMessageWithOptions(
      channelId,
      `Fast someone needs your help! Anyone up for the challenge?`,
      opts
    );
    await createNewSession(sessionId, msg.ts, info);
    res.send('Sent');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal error');
  }
}
