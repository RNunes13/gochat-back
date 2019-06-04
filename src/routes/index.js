
// Routes
import auth from './auth';
import users from './user';
import rooms from './room';
import messages from './message';
import roomUsers from './roomUser';

const BASE = '/api'

export default (app) => {
  app.get(BASE, (_, res) => res.status(200).send({
    success: true,
    message: 'Welcome to the GoChat API!',
  }));

  // Login
  auth(app, BASE);

  // Users - [BASE]/users
  users(app, BASE);

  // Rooms - [BASE]/rooms
  rooms(app, BASE);

  // RoomUsers - [BASE]/room-users
  roomUsers(app, BASE);

  // Messages - [BASE]/messages
  messages(app, BASE);
};
