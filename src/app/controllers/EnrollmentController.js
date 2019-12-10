import { addMonths, parseISO } from 'date-fns';

import Enrollment from '../models/Enrollment';
import Student from '../models/Student';
import Plan from '../models/Plan';

class EnrollmentController {
  async index(req, res) {
    const enrollments = await Enrollment.findAll({
      attributes: ['id', 'start_date', 'end_date', 'price'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title', 'duration', 'price'],
        },
      ],
    });

    return res.json(enrollments);
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

    if (studentCheckEnrollment)
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

    return res.send(204);
  }
}

export default new EnrollmentController();
