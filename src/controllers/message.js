
import model from '../models';

const { Message } = model;

class Messages {
  static async create(req, res) {
    const { message, room, user } = req.body;

    if (!message || !room || !user) {
      return res.status(400).send({ success: false, message: 'Enter the properties \'message\', \'room\' and \'user\'' });
    }

    try {
      const messageCreated = await Message.create({ message, roomId: room, userId: user });

      return res.status(201).send({
        success: true,
        message: 'Message successfully created',
        data: messageCreated,
      });
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: error.message ? error.message : error
      })
    }
  }

  static list(_, res) {
    return Message
      .findAll()
      .then(messages => res.status(200).send(messages));
  }

  static listByPk(req, res) {
    return Message
      .findByPk(req.params.message_id)
      .then(message => {
        if(!message) {
          return res.status(400).send({ success: false, message: 'Message Not Found' });
        }

        return res.status(200).send(message);
      })
      .catch(error => res.status(400).send({ success: false, message: error.message }));
  }
}

export default Messages;
