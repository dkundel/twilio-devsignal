import Twilio from 'twilio';
import kebabCase from 'lodash/kebabCase';

import {
  TWILIO_ACCOUNT_SID,
  TWILIO_API_KEY,
  TWILIO_API_SECRET,
  TWILIO_CHAT_SERVICE_SID
} from '../config';

export const client = new Twilio(TWILIO_API_KEY, TWILIO_API_SECRET, {
  accountSid: TWILIO_ACCOUNT_SID
});

export const chatService = client.chat.services(TWILIO_CHAT_SERVICE_SID);

export async function createChannel(accountSid, sessionId, name) {
  const userIdentity = `${accountSid}:${kebabCase(name)}`;
  let user;
  try {
    user = await chatService.users.create({
      identity: userIdentity,
      friendlyName: name
    });
  } catch (err) {
    if (err.status !== 409) {
      console.error(err);
    }
  }

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
    identity: userIdentity
  });

  return userIdentity;
}
