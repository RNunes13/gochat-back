
// Controllers
import Rooms from '../controllers/room';
import Auth from '../controllers/auth';

export default (app, baseUrl) => {
  app.get(`${baseUrl}/rooms`, Auth.verifyToken, Rooms.list);
  app.get(`${baseUrl}/rooms/:room_id`, Auth.verifyToken, Rooms.listByPk);
  app.post(`${baseUrl}/rooms`, Auth.verifyToken, Rooms.create);
  app.post(`${baseUrl}/rooms/users`, Auth.verifyToken, Rooms.createWithUsers);
  app.put(`${baseUrl}/rooms/:room_id`, Auth.verifyToken, Rooms.update);
  app.delete(`${baseUrl}/rooms/:room_id`, Auth.verifyToken, Rooms.delete);
};
