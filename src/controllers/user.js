
import model from '../models';
import Auth from './auth';
import { CustomResponse } from '../utils';

const { User } = model;

class Users {
  static async create(req, res) {
    const { name, username, email, password, disabled } = req.body;

    try {
      if (!password) 
        throw { code: 'user/bad-body', message: 'Password is required' };

      const hashPassword = Auth.hashPassword(password);

      const user = await User.create({
        name,
        username,
        email,
        disabled,
        password: hashPassword,
      });

      return res.status(201).send(CustomResponse({
        success: true,
        message: 'User successfully created',
        data: Users.userWithoutPassword(user)
      }));
    } catch (error) {
      return Users.exceptionResponse(res, error);
    }
  }

  static list(_, res) {
    return User
      .findAll({
        order: [
          ['id', 'ASC']
        ]
      })
      .then(users => res.status(200).send(Users.userWithoutPassword(users)))
      .catch(error => Users.exceptionResponse(res, error));
  }

  static listByPk(_, res) {
    return User
      .findByPk(req.params.user_id)
      .then(user => {
        if(!user) return Users.userNotFoundResponse(res);

        return res.status(200).send(CustomResponse({
          success: true,
          data: Users.userWithoutPassword(user),
        }));
      })
      .catch(Users.exceptionResponse(res, error));
  }

  static async update(req, res) {
    const { name, username, email, disabled } = req.body;

    if (!name && !username && !email && !disabled) {
      return res.status(400).send(CustomResponse({
        success: false,
        error: {
          code: 'user/bad-body',
          message: 'Upgrading a user requires at least one data',
        }
      }));
    }

    try {
      const user = await User.findByPk(req.params.user_id);

      if (!user) return Users.userNotFoundResponse(res);

      const updatedUser = await user.update({
        name: name || user.name,
        username: username || user.username,
        email: email || user.email,
        disabled: disabled || user.disabled,
      });

      return res.status(200).send(CustomResponse({
        success: true,
        message: 'User updated successfully',
        data: Users.userWithoutPassword(updatedUser)
      }));
    } catch (error) {
      return Users.exceptionResponse(res, error);
    }
  }

  static async updatePassword(req, res) {
    const { new_password, old_password } = req.body;

    try {
      const user = await User.findByPk(req.params.user_id);

      if (!user) return Users.userNotFoundResponse(res);

      if (!Auth.comparePassword(user.password, old_password))
        throw { code: 'user/wrong-password', message: 'Old password is incorrect' };

      const hashPassword = Auth.hashPassword(new_password);

      await user.update({
        ...user,
        password: hashPassword,
      });

      return res.status(200).send(CustomResponse({
        success: true,
        message: 'Password updated successfully'
      }));

    } catch(error) {
      return Users.exceptionResponse(res, error);
    }
  }

  static async delete(req, res) {
    try {
      const user = await User.findByPk(req.params.user_id);
      
      if (!user) return Users.userNotFoundResponse(res);

      await user.destroy();

      res.status(200).send(CustomResponse({
        success: true,
        message: 'User successfully deleted'
      }));
    } catch (error) {
      return Users.exceptionResponse(res, error);
    }
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

  static userNotFoundResponse(res) {
    return res.status(400).send(CustomResponse({
      success: false,
      error: {
        code: 'user/not-found',
        message: 'User not found'
      }
    }));
  }

  static exceptionResponse(res, error) {
    return res.status(400).send(CustomResponse({
      success: false,
      error
    }));
  }
}

export default Users;
