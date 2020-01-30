import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

class HelpOrderController {
  async index(req, res) {
    const page = parseInt(req.query.page || 1, 10);
    const perPage = parseInt(req.query.perPage || 5, 10);

    const studentExists = await Student.findByPk(req.params.id);

    if (!studentExists)
      return res.status(400).json({ error: 'Student not found' });

    const helporders = await HelpOrder.findAndCountAll({
      order: [['created_at', 'DESC']],
      where: { student_id: req.params.id },
      limit: perPage,
      offset: (page - 1) * perPage,
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name'],
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
    const { student_id } = req.params;
    const { question } = req.body;

    const student = await Student.findByPk(student_id);

    if (!student)
      return res.status(400).json({
        error: 'Ocorreu um erro:',
        messages: [{ path: 'student_id', message: 'Aluno não encontrado' }],
      });

    const help_order_created = await HelpOrder.create({
      student_id,
      question,
    });

    const help_order = await help_order_created.reload({
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name'],
        },
      ],
    });

    req.io.emit('HELP_ORDER_CREATE_NOTIFICATION', help_order);

    return res.json(help_order);
  }
}

export default new HelpOrderController();
