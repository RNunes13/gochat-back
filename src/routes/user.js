
// Controllers
import Users from '../controllers/user';
import Auth from '../controllers/auth';

export default (app, baseUrl) => {
  app.get(`${baseUrl}/users`, Auth.verifyToken, Users.list);
  app.get(`${baseUrl}/users/:user_id`, Auth.verifyToken, Users.listByPk);
  app.get(`${baseUrl}/users/:user_id/contacts_info`, Auth.verifyToken, Users.getContactsInfo);
  app.post(`${baseUrl}/users`, Users.create);
  app.post(`${baseUrl}/users/username_availability`, Users.checkUsername);
  app.put(`${baseUrl}/users/:user_id`, Auth.verifyToken, Users.update);
  app.put(`${baseUrl}/users/:user_id/password`, Auth.verifyToken, Users.updatePassword);
  app.put(`${baseUrl}/users/:user_id/rooms`, Auth.verifyToken, Users.updateRooms);
  app.delete(`${baseUrl}/users/:user_id`, Auth.verifyToken, Users.delete);
};
