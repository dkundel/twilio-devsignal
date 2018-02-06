import Twilio from 'twilio';
import kebabCase from 'lodash/kebabCase';

import {
  TWILIO_ACCOUNT_SID,
  TWILIO_API_KEY,
  TWILIO_API_SECRET,
  TWILIO_CHAT_SERVICE_SID
} from '../config';

const { AccessToken } = Twilio.jwt;

export const client = new Twilio(TWILIO_API_KEY, TWILIO_API_SECRET, {
  accountSid: TWILIO_ACCOUNT_SID
});

export const chatService = client.chat.services(TWILIO_CHAT_SERVICE_SID);

export async function safeCreateUser(options) {
  try {
    return await chatService.users.create(options);
  } catch (err) {
    if (err.status !== 409) {
      console.error(err);
    }
  }
}

export async function createChannel(accountSid, sessionId, name) {
  const userIdentity = `${accountSid}:${kebabCase(name)}`;
  await safeCreateUser({ identity: userIdentity, friendlyName: name });
  await safeCreateUser({
    identity: 'devangel',
    friendlyName: 'Twilio Developer Evangelist'
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
    identity: userIdentity
  });
  await chatService.channels(channel.sid).members.create({
    identity: 'devangel'
  });

  return userIdentity;
}

export async function sendMessageToChannel(body, channel, identity) {
  await chatService.channels(channel).messages.create({
    body,
    from: identity
  });
}

export async function getChannelNameFromSid(sid) {
  const { uniqueName } = await chatService.channels(sid).fetch();
  return uniqueName;
}

export function generateTokenFor(identity) {
  const accessToken = new AccessToken(
    TWILIO_ACCOUNT_SID,
    TWILIO_API_KEY,
    TWILIO_API_SECRET
  );

  accessToken.identity = identity;
  accessToken.ttl = 2 * 60 * 60;

  const endpointId = `Devsignal:${identity}:web`;
  const grant = new AccessToken.ChatGrant();
  grant.endpointId = endpointId;
  grant.serviceSid = TWILIO_CHAT_SERVICE_SID;
  accessToken.addGrant(grant);

  return accessToken.toJwt();
}
