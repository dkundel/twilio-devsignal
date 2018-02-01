import express from 'express';
import { resolve } from 'path';

const PORT = process.env.PORT || 4000;

const app = express();
const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  app.use(express.static(resolve(__dirname, '../build')));
}

app.get('/', (req, res) => {
  res.send('Hello World!');
});

if (isProd) {
  app.get('*', (req, res) => {
    res.sendFile(resolve(__dirname, '../build/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
