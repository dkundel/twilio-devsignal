import Twilio from 'twilio';

import {
  TWILIO_ACCOUNT_SID,
  TWILIO_API_KEY,
  TWILIO_API_SECRET,
  TWILIO_SYNC_SERVICE_SID
} from '../config';

export const client = new Twilio(TWILIO_API_KEY, TWILIO_API_SECRET, {
  accountSid: TWILIO_ACCOUNT_SID
});

export const service = client.sync.services(TWILIO_SYNC_SERVICE_SID);

export const sessionMap = 'session_map';
export const threadToSessionMap = 'thread_to_session';

export async function setup() {
  try {
    await service.syncMaps.create({ uniqueName: sessionMap });
  } catch (err) {
    // already exists
  }
  try {
    await service.syncMaps.create({ uniqueName: threadToSessionMap });
  } catch (err) {
    // already exists
  }
}

export async function createNewSession(sessionId, threadId, info) {
  const data = { ...info, threadId };
  const createSessionEntry = service.syncMaps(sessionMap).syncMapItems.create({
    key: sessionId,
    data
  });
  const createThreadEntry = service
    .syncMap(threadToSessionMap)
    .syncMapItems.create({
      key: threadId,
      data: { sessionId }
    });
  return Promise.all([createSessionEntry, createThreadEntry]);
}

export async function getInfoFromSessionId(sessionId) {
  const { data } = await service
    .syncMaps(sessionMap)
    .syncMapItems(sessionId)
    .fetch();
  return data;
}

export async function getInfoFromThreadId(threadId) {
  const { data } = await service
    .syncMaps(threadToSessionMap)
    .syncMapItems(threadId)
    .fetch();
  return getInfoFromSessionId(data.sessionId);
}
