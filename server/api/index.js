import { Router } from 'express';
import bodyParser from 'body-parser';

import handleCreateRequest from './request';
import safeRequest from '../utils/safeRequest';

const router = Router();

const json = bodyParser.json();
const urlencoded = bodyParser.urlencoded({ extended: false });
const parsers = [json, urlencoded];

router.post('/request', ...parsers, safeRequest(handleCreateRequest));

export default router;
