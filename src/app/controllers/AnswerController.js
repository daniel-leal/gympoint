import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

import Mail from '../../lib/Mail';

class AnswerController {
  async store(req, res) {
    const { help_order_id } = req.params;
    const { answer } = req.body;

    const help_order = await HelpOrder.findByPk(help_order_id, {
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    if (!help_order)
      return res.status(400).json({
        error: 'Ocorreu um erro:',
        messages: [
          { path: 'help_order_id', message: 'Pedido de ajuda não encontrado' },
        ],
      });

    if (help_order.answer !== null)
      return res.status(400).json({
        error: 'Ocorreu um erro:',
        messages: [
          { path: 'help_order_id', message: 'Pedido de ajuda já atendido' },
        ],
      });

    await help_order.update({
      answer,
      answer_at: new Date(),
    });

    await Mail.sendMail({
      to: `${help_order.student.name} <${help_order.student.email}>`,
      subject: 'Pedido de ajuda - [Resposta]',
      template: 'AnswerMail',
      context: {
        name: help_order.student.name,
        question: help_order.question,
        answer: help_order.answer,
      },
    });

    return res.json(help_order);
  }
}

export default new AnswerController();
