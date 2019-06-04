
// Controllers
import RoomUsers from '../controllers/roomUser';
import Auth from '../controllers/auth';

export default (app, baseUrl) => {
  app.delete(`${baseUrl}/room-users/:room_id/:user_id`, Auth.verifyToken, RoomUsers.removeUser);
};
