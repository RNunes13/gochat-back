
// Controllers
import Auth from '../controllers/auth';

export default (app, baseUrl) => {
  app.post(`${baseUrl}/login`, Auth.login);
  app.get(`${baseUrl}/checkUser`, Auth.checkUser);
};
