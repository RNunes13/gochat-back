
// Routes
import users from './user';

const BASE = '/api'

export default (app) => {
  app.get(BASE, (req, res) => res.status(200).send({
    success: true,
    message: 'Welcome to the GoChat API!',
  }));

  // Users - [BASE]/users
  users(app, BASE);
};
