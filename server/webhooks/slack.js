import { createSlackEventAdapter } from '@slack/events-api';
import { WebClient } from '@slack/client';

import { SLACK_VERIFICATION_TOKEN, SLACK_TOKEN } from '../config';

const slackEvents = createSlackEventAdapter(SLACK_VERIFICATION_TOKEN);
const client = new WebClient(SLACK_TOKEN);

function safeAsync(fn) {
  return (...args) => {
    fn(...args).catch(console.error);
  };
}

async function getBotUser(bot) {
  const botInfo = await client.bots.info({ bot });
  console.log(botInfo);
  return 'foo';
}

async function lookUpUser(userId) {
  const { user } = await client.users.info(userId);
  const { name, profile } = user;
  const { bot_id } = profile;
  const isBot = !!bot_id;
  return { isBot, name };
}

async function isThreadStartedByBot(evt) {
  const { parent_user_id, thread_ts } = evt;

  if (!thread_ts || !parent_user_id) {
    return false;
  }

  const { isBot, name } = await lookUpUser(parent_user_id);

  return isBot && name.indexOf('devsignal') === 0;
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
}

async function onAppMention(evt) {
  const { channel, ts, thread_ts } = evt;
  if (!thread_ts) {
    await client.chat.postMessage(
      channel,
      'Please only respond inside threads...Thank you :penguin-flip:',
      {
        as_user: true,
        thread_ts: ts
      }
    );
  }
}

slackEvents.on('message', safeAsync(onMessage));

slackEvents.on('app_mention', safeAsync(onAppMention));

slackEvents.on('error', console.error);

const requestHandler = slackEvents.expressMiddleware();
export default requestHandler;
