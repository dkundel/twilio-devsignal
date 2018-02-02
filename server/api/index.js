import { Router } from 'express';
import bodyParser from 'body-parser';

import handleCreateRequest from './request';

const router = Router();

const json = bodyParser.json();
const urlencoded = bodyParser.urlencoded({ extended: false });
const parsers = [json, urlencoded];

router.post('/request', ...parsers, handleCreateRequest);

export default router;
