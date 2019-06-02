
// Routes
import users from './user';
import auth from './auth';

const BASE = '/api'

export default (app) => {
  app.get(BASE, (req, res) => res.status(200).send({
    success: true,
    message: 'Welcome to the GoChat API!',
  }));

  // Login
  auth(app, BASE);

  // Users - [BASE]/users
  users(app, BASE);
};
