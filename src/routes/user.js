
// Controllers
import Users from '../controllers/user';
import Auth from '../controllers/auth';

export default (app, baseUrl) => {
  app.get(`${baseUrl}/users`, Auth.verifyToken, Users.list);
  app.get(`${baseUrl}/users/:user_id`, Auth.verifyToken, Users.listByPk);
  app.post(`${baseUrl}/users`, Users.create);
  app.put(`${baseUrl}/users/:user_id`, Auth.verifyToken, Users.update);
  app.put(`${baseUrl}/users/:user_id/password`, Auth.verifyToken, Users.updatePassword);
  app.delete(`${baseUrl}/users/:user_id`, Auth.verifyToken, Users.delete);
};
