
// Controllers
import Users from '../controllers/user';

export default (app, baseUrl) => {
  app.get(`${baseUrl}/users`, Users.list);
  app.get(`${baseUrl}/users/:user_id`, Users.listByPk);
  app.post(`${baseUrl}/users`, Users.create);
  app.put(`${baseUrl}/users/:user_id`, Users.update);
  app.delete(`${baseUrl}/users/:user_id`, Users.delete);
};
