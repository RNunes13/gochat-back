
import model from '../models';
import { CustomResponse } from '../utils';

const { Message } = model;

class Messages {
  static async create(req, res) {
    const { message, room, user } = req.body;

    if (!message || !room || !user) {
      return res.status(400).send(CustomResponse({
        success: false,
        error: {
          code: 'message/bad-body',
          message: 'Enter the properties \'message\', \'room\' and \'user\''
        }
      }));
    }

    try {
      const messageCreated = await Message.create({ message, roomId: room, userId: user });

      return res.status(201).send(CustomResponse({
        success: true,
        message: 'Message successfully created',
        data: messageCreated,
      }));
    } catch (error) {
      return res.status(500).send(CustomResponse({
        success: false,
        error
      }))
    }
  }

  static list(_, res) {
    return Message
      .findAll()
      .then(messages => res.status(200).send(messages))
      .catch(error => res.status(400).send(CustomResponse({ success: false, error })));
  }

  static listByPk(req, res) {
    return Message
      .findByPk(req.params.message_id)
      .then(message => {
        if(!message) {
          return res.status(400).send(CustomResponse({
            success: false,
            error: {
              code: 'message/not-found',
              message: 'Message Not Found'
            }
          }));
        }

        return res.status(200).send(message);
      })
      .catch(error => res.status(400).send(CustomResponse({ success: false, error })));
  }
}

export default Messages;
