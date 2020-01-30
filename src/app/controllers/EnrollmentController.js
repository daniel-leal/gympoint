import { Op } from 'sequelize';
import { addMonths, parseISO } from 'date-fns';
import Queue from '../../lib/Queue';
import EnrollmentMail from '../jobs/EnrollmentMail';

import Enrollment from '../models/Enrollment';
import Student from '../models/Student';
import Plan from '../models/Plan';

class EnrollmentController {
  async index(req, res) {
    const term = req.query.term || '';
    const page = parseInt(req.query.page || 1, 10);
    const perPage = parseInt(req.query.perPage || 5, 10);
    const enrollments = await Enrollment.findAndCountAll({
      order: ['id'],
      where: {
        [Op.or]: [
          {
            '$student.name$': {
              [Op.iLike]: `%${term}%`,
            },
          },
          {
            '$plan.title$': {
              [Op.iLike]: `%${term}%`,
            },
          },
        ],
      },
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title', 'duration', 'price'],
        },
      ],
      limit: perPage,
      offset: (page - 1) * perPage,
    });

    // return res.json(enrollments);

    const totalPage = Math.ceil(enrollments.count / perPage);

    return res.json({
      page,
      perPage,
      data: enrollments.rows,
      total: enrollments.count,
      totalPage,
    });
  }

  async get(req, res) {
    const { id } = req.params;

    const enrollment = await Enrollment.findOne({
      where: {
        id,
      },
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title', 'duration', 'price'],
        },
      ],
    });

    if (!enrollment)
      return res.status(400).json({
        error: 'Ocorreu um erro:',
        messages: [{ path: 'id', message: 'Matrícula não encontrada' }],
      });

    return res.json(enrollment);
  }

  async store(req, res) {
    const { student_id } = req.params;
    const { plan_id, start_date } = req.body;

    const student = await Student.findByPk(student_id);

    if (!student)
      return res.status(400).json({
        error: 'Ocorreu um erro:',
        messages: [{ path: 'student_id', message: 'Aluno não encontrado' }],
      });

    const plan = await Plan.findByPk(plan_id);

    if (!plan)
      return res.status(400).json({
        error: 'Ocorreu um erro:',
        messages: [{ path: 'plan_id', message: 'Plano não encontrado' }],
      });

    const studentCheckEnrollment = await Enrollment.findOne({
      where: {
        student_id,
      },
    });

    if (studentCheckEnrollment && studentCheckEnrollment.active)
      return res.status(400).json({
        error: 'Ocorreu um erro:',
        messages: [{ path: 'id', message: 'Este aluno já está em um plano' }],
      });

    const end_date = addMonths(parseISO(start_date), plan.duration);

    const enrollment = await Enrollment.create({
      plan_id,
      student_id,
      start_date,
      end_date,
      price: plan.duration * plan.price,
    });

    await Queue.add(EnrollmentMail.key, { enrollment, student, plan });

    return res.json(enrollment);
  }

  async update(req, res) {
    const { id } = req.params;
    const { plan_id, student_id, start_date } = req.body;

    const enrollment = await Enrollment.findByPk(id);
    if (!enrollment)
      return res.status(400).json({
        error: 'Ocorreu um erro:',
        messages: [{ path: 'id', message: 'Matrícula não encontrada' }],
      });

    const plan = await Plan.findByPk(plan_id);
    if (!plan)
      return res.status(400).json({
        error: 'Ocorreu um erro:',
        messages: [{ path: 'plan_id', message: 'Plano não encontrado' }],
      });

    const student = await Student.findByPk(student_id);
    if (!student)
      return res.status(400).json({
        error: 'Ocorreu um erro:',
        messages: [{ path: 'student_id', message: 'Aluno não encontrado' }],
      });

    const end_date = addMonths(parseISO(start_date), plan.duration);

    await enrollment.update({
      plan_id,
      student_id,
      start_date,
      end_date,
      price: plan.duration * plan.price,
    });

    return res.json(enrollment);
  }

  async delete(req, res) {
    const enrollment = await Enrollment.findByPk(req.params.id);

    if (!enrollment) {
      return res.status(400).json({
        error: 'Ocorreu um erro:',
        messages: [{ path: 'id', message: 'Matrícula não encontrada' }],
      });
    }

    await enrollment.destroy();

    return res.sendStatus(204);
  }
}

export default new EnrollmentController();
