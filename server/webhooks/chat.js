import { getChannelNameFromSid } from '../services/chat';
import { getInfoFromSessionId } from '../services/data';
import { BOT_CHANNEL } from '../config';
import { sendMessageToThread } from '../services/slack';

function safeAsync(fn) {
  return (req, res, next) => {
    fn(req, res, next).catch(err => {
      console.error(err);
      res.status(500).send('Internal Error');
    });
  };
}

export async function handleRequest(req, res, next) {
  const { EventType, ChannelSid, From, Body } = req.body;

  if (EventType !== 'onMessageSent') {
    res.send();
    return;
  }

  const sessionId = await getChannelNameFromSid(ChannelSid);
  const info = await getInfoFromSessionId(sessionId);

  if (From !== info.identity && From !== 'devangel') {
    // no need to forward to slack
    res.send();
    return;
  }

  try {
    let messageContent;
    if (From === 'devangel') {
      messageContent =
        ':warning: Another devangel answered in the chat. Open the chat dialog to see the full history :warning:';
    } else {
      messageContent = `_${info.name} wrote:_\n${Body}`;
    }
    await sendMessageToThread(BOT_CHANNEL, info.threadId, messageContent);
  } catch (err) {
    console.error(err);
  }
  res.send();
}

export const handleRequestSafely = safeAsync(handleRequest);

export default handleRequestSafely;
