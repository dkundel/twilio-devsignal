import { createSlackEventAdapter } from '@slack/events-api';
import { WebClient } from '@slack/client';

import { SLACK_VERIFICATION_TOKEN, SLACK_TOKEN } from '../config';
import { sendMessageToThread, lookUpUser, getBotId } from '../services/slack';
import { getInfoFromThreadId } from '../services/data';
import { sendMessageToChannel } from '../services/chat';

const slackEvents = createSlackEventAdapter(SLACK_VERIFICATION_TOKEN);
const client = new WebClient(SLACK_TOKEN);

function safeAsync(fn) {
  return (...args) => {
    fn(...args).catch(console.error);
  };
}

async function isThreadStartedByBot(evt) {
  const { parent_user_id, thread_ts } = evt;

  if (!thread_ts || !parent_user_id) {
    return false;
  }

  const { isBot } = await lookUpUser(parent_user_id);
  const user_id = await getBotId();

  return isBot && parent_user_id === user_id;
}

async function onMessage(evt) {
  const { isBot } = await lookUpUser(evt.user);
  if (isBot) {
    return;
  }

  const isRelevantMessage = await isThreadStartedByBot(evt);
  if (!isRelevantMessage) {
    return;
  }

  // message is in response to a thread that was started by this bot
  // handle message
  const info = await getInfoFromThreadId(evt.thread_ts);
  // console.log(evt);
  await sendMessageToChannel(evt.text, info.sessionId);
}

async function onAppMention(evt) {
  const { channel, ts, thread_ts } = evt;
  if (!thread_ts) {
    await sendMessageToThread(
      channel,
      thread_ts,
      'Please only respond inside threads...Thank you :penguin-flip:'
    );
  }
}

slackEvents.on('message', safeAsync(onMessage));

slackEvents.on('app_mention', safeAsync(onAppMention));

slackEvents.on('error', console.error);

const requestHandler = slackEvents.expressMiddleware();
export default requestHandler;
