
// Routes
import users from './user';
import Auth from '../controllers/auth';

const BASE = '/api'

export default (app) => {
  app.get(BASE, (req, res) => res.status(200).send({
    success: true,
    message: 'Welcome to the GoChat API!',
  }));

  // Login
  app.post(`${BASE}/login`, Auth.login);

  // Users - [BASE]/users
  users(app, BASE);
};
