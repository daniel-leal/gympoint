import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

class HelpOrderController {
  async index(req, res) {
    const help_orders = await HelpOrder.findAll({
      where: {
        answer: null,
      },
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    return res.json(help_orders);
  }

  async get(req, res) {
    const { student_id } = req.params;

    const help_orders = await HelpOrder.findAll({
      where: {
        student_id,
      },
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    return res.json(help_orders);
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

    const help_order = await HelpOrder.create({
      student_id,
      question,
    });

    /**
     * TODO: SEND MAIL
     */

    return res.json(help_order);
  }
}

export default new HelpOrderController();
