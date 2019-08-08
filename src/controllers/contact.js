
import model from '../models';
import { CustomResponse } from '../utils';

const { Contact, User } = model;

class Contacts {
  static async create(req, res) {
    const { owner, contact_username } = req.body;

    try {
      if (!owner || !contact_username) 
        throw { code: 'contact/bad-body', message: 'Enter the properties \'owner\', and \'contact_username\'' };


      const userContact = await User.findOne({ where: { username: contact_username.toLocaleLowerCase() } });

      if (!userContact)
        throw { code: 'contact/contact-not-found', message: 'Could not find user with username entered' };
      
      const contact = await Contact.create({
        ownerId: owner.id,
        contactId: userContact.id,
      });

      return res.status(201).send(CustomResponse({
        success: true,
        message: 'Contact successfully created',
        data: contact
      }));
    } catch (error) {
      return res.status(400).send(CustomResponse({
        success: false,
        error
      }));
    }
  }

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
