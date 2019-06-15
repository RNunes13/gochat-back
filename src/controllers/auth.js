
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import model from '../models';
import { CustomResponse } from '../utils';

const { User } = model;
const HEADER_TOKEN = 'x-access-token';
const MAX_AGE_COOKIE = 604800000; // In milliseconds -> 7d

class Auth {
  static login(req, res) {
    const { username, password } = req.body;

    if (!username || !password) return res.status(400).send(CustomResponse({
      success: false,
      error: {
        code: 'auth/bad-body',
        message: 'Enter the username and password'
      }
    }));

    return User.findOne({
      where: { username }
    })
    .then(user => {
      if(!user) {
        return res.status(200).send(CustomResponse({
          success: false,
          error: {
            code: 'user/not-found',
            message: 'User not found'
          }
        }));
      }

      if (!Auth.comparePassword(user.password, password)) {
        return res.status(200).send(CustomResponse({
          success: false,
          error: {
            code: 'auth/incorrect-credentials',
            message: 'The credentials you provided is incorrect'
          }
        }));
      }

      const token = Auth.generateToken(user.id);

      return res.status(200).send(CustomResponse({
        success: true,
        message: 'Authenticated user',
        data: token,
      }));
    })
    .catch(error => res.status(400).send(CustomResponse({ success: false, error })));
  }

  static async checkUser(req, res) {
    const token = req.headers[HEADER_TOKEN];

    if (!token)
      return res.status(200).send(CustomResponse({
        success: false,
        error: {
          code: 'auth/token-not-provided',
          message: 'Token is not provided'
        }
      }));

    try {
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findOne({ where: { id: decoded.userId } });

      if (!user) {
        return res.status(200).send(CustomResponse({
          success: false,
          error: {
            code: 'user/token-invalid',
            message: 'The token you provided is invalid'
          }
        }));
      }

      user.password = undefined;

      return res.status(200).send(CustomResponse({
        success: true,
        data: user,
      }));
    } catch(error) {
      return res.status(400).send(CustomResponse({ success: false, error }));
    }
  }

  static hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(12))
  }

  static comparePassword(hashPassword, password) {
    return bcrypt.compareSync(password, hashPassword);
  }

  static generateToken(id) {
    const token = jwt.sign(
      { userId: id },
      process.env.JWT_SECRET,
      { expiresIn: MAX_AGE_COOKIE / 1000 }
    );

    return token;
  }

  static async verifyToken(req, res, next) {
    const token = req.headers[HEADER_TOKEN];

    if (!token) {
      return res.status(400).send(CustomResponse({
        success: false,
        error: {
          code: 'auth/token-not-provided',
          message: 'Token is not provided'
        }
      }));
    }

    try {
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findOne({where: { id: decoded.userId }});

      if (!user) {
        return res.status(400).send(CustomResponse({
          success: false,
          error: {
            code: 'user/token-invalid',
            message: 'The token you provided is invalid'
          }
        }));
      }

      req.user = { id: decoded.userId };
      next();
    } catch(error) {
      return res.status(400).send(CustomResponse({ success: false, error }));
    }
  }
}

export default Auth;
