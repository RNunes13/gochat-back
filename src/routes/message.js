
// Controllers
import Messages from '../controllers/message';
import Auth from '../controllers/auth';

export default (app, baseUrl) => {
  app.get(`${baseUrl}/messages`, Auth.verifyToken, Messages.list);
  app.get(`${baseUrl}/messages/:message_id`, Auth.verifyToken, Messages.listByPk);
  app.post(`${baseUrl}/messages`, Auth.verifyToken, Messages.create);
};
