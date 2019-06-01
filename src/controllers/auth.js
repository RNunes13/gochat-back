
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import model from '../models';

const { User } = model;

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

      return res.status(200).send({ success: true, data: token });
    })
    .catch(error => res.status(400).send({ success: false, message: error.message }));
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
      { expiresIn: '7d' }
    );

    return token;
  }

  static async verifyToken(req, res, next) {
    const token = req.headers['x-access-token'];

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
      return res.status(400).send({ success: false, message: error.message ? error.message : error });
    }
  }
}
  
export default Auth;
