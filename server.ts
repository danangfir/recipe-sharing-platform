const express = require('express');
const next = require('next');
const mongoose = require('mongoose');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const port = process.env.PORT || 3000;

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/recipe-sharing';

mongoose.connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err: Error) => console.error('Error connecting to MongoDB:', err));

app.prepare().then(() => {
  const server = express();

  server.all('*', (req: any, res: any) => {
    return handle(req, res);
  });

  server.listen(port, (err?: any) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
