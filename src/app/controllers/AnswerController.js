import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

import AnswerMail from '../jobs/AnswerMail';
import Queue from '../../lib/Queue';

class AnswerController {
  async index(req, res) {
    const page = parseInt(req.query.page || 1, 10);
    const perPage = parseInt(req.query.perPage || 10, 10);

    const helporders = await HelpOrder.findAndCountAll({
      where: { answer_at: null },
      order: ['createdAt'],
      limit: perPage,
      offset: (page - 1) * perPage,
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    const totalPage = Math.ceil(helporders.count / perPage);

    return res.json({
      page,
      perPage,
      data: helporders.rows,
      total: helporders.count,
      totalPage,
    });
  }

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

    await Queue.add(AnswerMail.key, {
      help_order,
    });

    return res.json(help_order);
  }
}

export default new AnswerController();
