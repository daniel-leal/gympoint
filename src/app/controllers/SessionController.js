import jwt from 'jsonwebtoken';

import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    const errorMsg = {
      error: 'Ocorreu um erro:',
      messages: [{ path: '', message: 'Usuário ou Senha inválidos' }],
    };

    if (!user) {
      return res.status(401).json(errorMsg);
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json(errorMsg);
    }

    const { id, name } = user;

    return res.json({
      token: jwt.sign({ id, name }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
