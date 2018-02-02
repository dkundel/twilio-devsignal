import { Router } from 'express';
import bodyParser from 'body-parser';

import handleChatRequest from './chat';
import handleSlackRequest from './slack';

const router = Router();

const json = bodyParser.json();
const urlencoded = bodyParser.urlencoded({ extended: false });
const parsers = [json, urlencoded];

router.post('/chat', ...parsers, handleChatRequest);
router.use('/slack', ...parsers, handleSlackRequest);

export default router;
