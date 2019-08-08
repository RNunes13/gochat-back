
// Controllers
import Contact from '../controllers/contact';
import Auth from '../controllers/auth';

export default (app, baseUrl) => {
  app.get(`${baseUrl}/contacts`, Auth.verifyToken, Contact.list);
  app.get(`${baseUrl}/contacts/:user_id`, Auth.verifyToken, Contact.listByUser);
  app.post(`${baseUrl}/contacts`, Auth.verifyToken, Contact.create);
};
