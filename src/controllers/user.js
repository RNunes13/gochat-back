
import model from '../models';
import Auth from './auth';

const { User } = model;

class Users {
  static create(req, res) {
    const { name, username, email, password, disabled } = req.body;

    const hashPassword = Auth.hashPassword(password);

    return User
      .create({
        name,
        username,
        email,
        disabled,
        password: hashPassword,
      })
      .then((userData) => res.status(201).send({
          success: true,
          message: 'User successfully created',
          data: userData
        })
      )
      .catch(error => res.status(500).send({
        success: false,
        message: error.message
      }));
  }

  static list(req, res) {
    return User
      .findAll()
      .then(users => res.status(200).send(users));
  }

  static listByPk(req, res) {
    return User
      .findByPk(req.params.user_id)
      .then(user => {
        if(!user) {
          return res.status(400).send({ success: false, message: 'User Not Found' });
        }

        return res.status(200).send(user);
      })
      .catch(error => res.status(400).send({ success: false, message: error.message }));
  }

  static update(req, res) {
    const { name, username, email, password, disabled } = req.body;

    return User
      .findByPk(req.params.user_id)
      .then((user) => {
        if (!user) {
          return res.status(400).send({ success: false, message: 'User Not Found' });
        }

        user.update({
          name: name || user.name,
          username: username || user.username,
          email: email || user.email,
          password: password || user.password,
          disabled: disabled || user.disabled,
        })
        .then((updatedUser) => {
          res.status(200).send({
            success: true,
            message: 'User updated successfully',
            data: updatedUser
          })
        })
        .catch(error => res.status(400).send({
          success: false,
          message: error.message,
        }));
      })
      .catch(error => res.status(400).send({
        success: false,
        message: error.message,
      }));
  }

  static delete(req, res) {
    return User
      .findByPk(req.params.user_id)
      .then(user => {
        if(!user) {
          return res.status(400).send({ success: false, message: 'User Not Found' });
        }

        return user
          .destroy()
          .then(() => res.status(200).send({
            success: true,
            message: 'User successfully deleted',
          }))
          .catch(error => res.status(400).send({
            success: false,
            message: error.message,
          }));
      })
      .catch(error => res.status(400).send({
        success: false,
        message: error.message,
      }));
  }
}

export default Users;
