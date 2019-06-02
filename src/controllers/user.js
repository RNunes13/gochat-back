
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
          data: Users.userWithoutPassword(userData)
        })
      )
      .catch(error => res.status(500).send({
        success: false,
        message: error.message
      }));
  }

  static list(_, res) {
    return User
      .findAll({
        order: [
          ['id', 'ASC']
        ]
      })
      .then(users => res.status(200).send(Users.userWithoutPassword(users)));
  }

  static listByPk(req, res) {
    return User
      .findByPk(req.params.user_id)
      .then(user => {
        if(!user) {
          return res.status(400).send({ success: false, message: 'User Not Found' });
        }

        return res.status(200).send(Users.userWithoutPassword(user));
      })
      .catch(error => res.status(400).send({ success: false, message: error.message }));
  }

  static update(req, res) {
    const { name, username, email, disabled } = req.body;

    if (!name && !username && !email && !disabled) {
      return res.status(400).send({ success: false, message: 'Upgrading a user requires at least one data' });
    }

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
          disabled: disabled || user.disabled,
        })
        .then((updatedUser) => {
          res.status(200).send({
            success: true,
            message: 'User updated successfully',
            data: Users.userWithoutPassword(updatedUser)
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

  static async updatePassword(req, res) {
    const { password, old_password } = req.body;

    try {
      const user = await User.findByPk(req.params.user_id);

      if (!Auth.comparePassword(user.password, old_password)) throw 'Old password is incorrect';

      const hashPassword = Auth.hashPassword(password);

      const updatedUser = await user.update({
        ...user,
        password: hashPassword,
      });

      return res.status(200).send({
        success: true,
        message: 'Password updated successfully',
        data: Users.userWithoutPassword(updatedUser)
      });

    } catch(error) {
      return res.status(400).send({ success: false, message: error.message ? error.message : error });
    }
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

  static userWithoutPassword(users) {
    if (Array.isArray(users)) {
      return users.map((user) => {
        user.password = undefined;
        return user;
      });
    } else if (typeof users === 'object') {
      users.password = undefined;
      return users;
    } else {
      return users;
    }
  }
}

export default Users;
