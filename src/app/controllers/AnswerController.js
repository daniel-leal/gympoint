import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

class AnswerController {
  async store(req, res) {
    const { help_order_id } = req.params;
    const { answer } = req.body;

    const helpOrder = await HelpOrder.findByPk(help_order_id, {
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    if (!helpOrder)
      return res.status(400).json({
        error: 'Ocorreu um erro:',
        messages: [
          { path: 'help_order_id', message: 'Pedido de ajuda não encontrado' },
        ],
      });

    if (helpOrder.answer !== null)
      return res.status(400).json({
        error: 'Ocorreu um erro:',
        messages: [
          { path: 'help_order_id', message: 'Pedido de ajuda já atendido' },
        ],
      });

    await helpOrder.update({
      answer,
      answer_at: new Date(),
    });

    /**
     * TODO: SEND MAIL
     */

    return res.json(helpOrder);
  }
}

export default new AnswerController();
