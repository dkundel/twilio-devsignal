import express from 'express';
import { resolve } from 'path';

import webhookRouter from './webhooks';
import apiRouter from './api';

const PORT = process.env.PORT || 4000;

const app = express();
const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  app.use(express.static(resolve(__dirname, '../build')));
}

app.use('/webhook', webhookRouter);
app.use('/api', apiRouter);

if (isProd) {
  app.get('*', (req, res) => {
    res.sendFile(resolve(__dirname, '../build/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
