
import cors from 'cors';
import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import socket from 'socket.io';

import routes from './routes';

// Environments
const { PORT, HOST } = require('./config/environments');

const app = express();
const server = http.createServer(app);
const io = socket(server);

app.use((req, res, next) => {
  req.io = io;
  return next();
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

routes(app);

server.listen(PORT, HOST, () => {
  console.log(`[server] app listening at http://${HOST}:${PORT}/`)
});
