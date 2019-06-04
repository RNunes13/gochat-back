
import model from '../models';

const { Room, User } = model;

class Rooms {
  static create(req, res) {
    const { name } = req.body;

    return Room
      .create({ name })
      .then((roomData) => res.status(201).send({
          success: true,
          message: 'Room successfully created',
          data: roomData
        })
      )
      .catch(error => res.status(500).send({
        success: false,
        message: error.message
      }));
  }

  static async createWithUsers(req, res) {
    const { name, users } = req.body;

    if (!users || users.length === 0 ) {
      return res.status(400).send({ success: false, message: 'Enter users ID' });
    }

    try {
      const room = await Room.create({ name });

      await room.setUsers(users);

      return res.status(201).send({
        success: true,
        message: 'Room created with users',
      });
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: error.message ? error.message : error,
      })
    }
  }

  static list(_, res) {
    return Room
      .findAll({
        order: [ ['id', 'ASC']  ],
        include: [
          {
            model: User,
            as: 'users',
            through: { attributes: [] }
          }
        ]
      })
      .then(rooms => res.status(200).send(rooms.map((room) =>{
        if (room.users && room.users.length > 0) {
          room.users.forEach(user => user.password = undefined);
        }

        return room;
      })));
  }

  static listByPk(req, res) {
    return Room
      .findByPk(req.params.room_id, {
        include: [
          {
            model: User,
            as: 'users',
            through: { attributes: [] }
          }
        ]
      })
      .then(room => {
        if(!room) {
          return res.status(400).send({ success: false, message: 'Room Not Found' });
        }

        if (room.users && room.users.length > 0) {
          room.users.forEach(user => user.password = undefined);
        }

        return res.status(200).send(room);
      })
      .catch(error => res.status(400).send({ success: false, message: error.message }));
  }

  static async update(req, res) {
    const { name } = req.body;

    try {
      const room = await Room.findByPk(req.params.room_id);
      
      if (!room) {
        return res.status(400).send({ success: false, message: 'Room Not Found' });
      }
  
      const updatedRoom = await room.update({
        name: name || room.name,
      });

      res.status(200).send({
        success: true,
        message: 'Room updated successfully',
        data: updatedRoom
      })
    } catch (error) {
      return res.status(400).send({
        success: false,
        message: error.message ? error.message : error,
      });
    }
  }

  static async delete(req, res) {
    try {
      const room = await Room.findByPk(req.params.room_id);
      
      if(!room) {
        return res.status(400).send({ success: false, message: 'Room Not Found' });
      }

      await room.destroy();

      res.status(200).send({
        success: true,
        message: 'Room successfully deleted',
      });
    } catch (error) {
      return res.status(400).send({
        success: false,
        message: error.message ? error.message : error,
      });
    }
  }
}

export default Rooms;
