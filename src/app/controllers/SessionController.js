import User from '../models/User';

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

    return res.json({
      token: user.generateToken(),
    });
  }
}

export default new SessionController();
