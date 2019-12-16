import { Op } from 'sequelize';
import { subDays } from 'date-fns';

import Student from '../models/Student';
import Checkin from '../models/Checkin';

class CheckinController {
  async index(req, res) {
    const { student_id } = req.params;

    const checkins = await Checkin.findAll({
      where: { student_id },
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    return res.json(checkins);
  }

  async store(req, res) {
    const { student_id } = req.params;

    const student = await Student.findByPk(student_id);

    if (!student)
      return res.status(400).json({
        error: 'Ocorreu um erro:',
        messages: [{ path: 'student_id', message: 'Aluno não encontrado' }],
      });

    const countCheckins = await Checkin.findAndCountAll({
      where: {
        student_id,
        created_at: { [Op.between]: [subDays(new Date(), 7), new Date()] },
      },
    });

    if (countCheckins.count >= 5)
      return res.status(400).json({
        error: 'Ocorreu um erro:',
        messages: [
          { path: '', message: 'Você só pode ter 5 checkins a cada 7 dias' },
        ],
      });

    const checkin = await Checkin.create({
      student_id,
    });

    return res.json(checkin);
  }
}

export default new CheckinController();
