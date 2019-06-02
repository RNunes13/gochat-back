
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import model from '../models';

const { User } = model;
const TOKEN_COOKIE_NAME = 'user_token';
const MAX_AGE_COOKIE = 604800000; // In milliseconds -> 7d

class Auth {
  static login(req, res) {
    const { username, password } = req.body;

    return User.findOne({
      where: { username }
    })
    .then(user => {
      if(!user) {
        return res.status(400).send({ success: false, message: 'User Not Found' });
      }

      if (!Auth.comparePassword(user.password, password)) {
        return res.status(400).send({ success: false, message: 'The credentials you provided is incorrect' });
      }

      const token = Auth.generateToken(user.id);

      res.cookie(
        TOKEN_COOKIE_NAME,
        token,
        { maxAge: MAX_AGE_COOKIE, httpOnly: true, secure: process.env.NODE_ENV === 'production' }
      );

      return res.status(200).send({ success: true, message: 'Authenticated user' });
    })
    .catch(error => res.status(400).send({ success: false, message: error.message }));
  }

  static logout(_, res) {
    try {
      res.clearCookie(TOKEN_COOKIE_NAME);
    
      return res.status(200).send({ success: true });
    } catch (error) {
      return res.status(400).send({ success: false, message: error.message ? error.message : error });
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
      process.env.SECRET,
      { expiresIn: MAX_AGE_COOKIE / 1000 }
    );

    return token;
  }

  static async verifyToken(req, res, next) {
    const token = req.cookies[TOKEN_COOKIE_NAME];

    if (!token) {
      return res.status(400).send({ success: false, message: 'Token is not provided' });
    }

    try {
      const decoded = await jwt.verify(token, process.env.SECRET);
      const user = await User.findOne({where: { id: decoded.userId }});

      if (!user) {
        return res.status(400).send({ success: false, message: 'The token you provided is invalid' });
      }

      req.user = { id: decoded.userId };
      next();
    } catch(error) {
      if (error.name && error.name === 'TokenExpiredError') {
        res.clearCookie(TOKEN_COOKIE_NAME);
      }

      return res.status(400).send({ success: false, message: error.message ? error.message : error });
    }
  }
}

export default Auth;
