
import model from '../models';

const { RoomUser, Room, User } = model;

class RoomUsers {
  static async removeUser(req, res) {
    try {
      const roomsUser = await RoomUser.findOne({
        where: {
          roomId: req.params.room_id,
          userId: req.params.user_id,
        }
      });

      if (!roomsUser) {
        return res.status(400).send({ success: false, message: 'RoomUsers Not Found' });
      }

      await roomsUser.destroy();

      const room = await Room.findByPk(req.params.room_id, {
        include: [
          {
            model: User,
            as: 'users',
            through: { attribute: [] }
          }
        ]
      });

      if (room && room.users && room.users.length === 0) {
        await room.destroy();
      }

      return res.status(200).send({ success: true, message: 'User removed from room' });
    } catch (error) {
      return res.status(400).send({ success: false, message: error.message ? error.message : error })
    }
  }
}

export default RoomUsers;
