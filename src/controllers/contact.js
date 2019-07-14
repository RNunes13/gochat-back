
import model from '../models';
import { CustomResponse } from '../utils';

const { Contact } = model;

class Contacts {
  static list(_, res) {
    return Contact
      .findAll({
        order: [
          ['ownerId', 'ASC']
        ]
      })
      .then(contacts => res.status(200).send(contacts))
      .catch(error => res.status(400).send(CustomResponse({
        success: false,
        error
      })));
  }

  static listByUser(req, res) {
    return Contact
      .findAll({ where: { ownerId: req.params.user_id } })
      .then(contacts => res.status(200).send(contacts))
      .catch(error => res.status(400).send(CustomResponse({
        success: false,
        error
      })));
  }
}

export default Contacts;
