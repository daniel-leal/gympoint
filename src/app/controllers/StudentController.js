import { Op } from 'sequelize';

import Student from '../models/Student';

class StudentController {
  async index(req, res) {
    const name = req.query.name || '';
    const page = parseInt(req.query.page || 1, 10);
    const perPage = parseInt(req.query.perPage || 5, 10);

    const students = await Student.findAndCountAll({
      order: ['name'],
      where: {
        name: {
          [Op.iLike]: `%${name}%`,
        },
      },
      limit: perPage,
      offset: (page - 1) * perPage,
    });

    const totalPage = Math.ceil(students.count / perPage);

    return res.json({
      page,
      perPage,
      data: students.rows,
      total: students.count,
      totalPage,
    });
  }

  async get(req, res) {
    const student = await Student.findByPk(req.params.id);

    if (!student)
      return res.status(404).json({
        error: 'Ocorreu um erro:',
        messages: [{ path: 'id', message: 'Aluno não encontrado' }],
      });

    return res.json(student);
  }

  async store(req, res) {
    const { email } = req.body;

    const checkStudent = await Student.findOne({ where: { email } });

    if (checkStudent) {
      return res.status(400).json({
        error: 'Ocorreu um erro:',
        messages: [{ path: 'id', message: 'Aluno já cadastrado' }],
      });
    }

    const student = await Student.create(req.body);

    return res.status(201).json(student);
  }

  async update(req, res) {
    const { email } = req.body;

    if (email) {
      const checkStudent = await Student.findOne({ where: { email } });

      if (checkStudent) {
        return res.status(401).json({
          error: 'Ocorreu um erro:',
          messages: [
            {
              path: 'email',
              message: 'Já existe um aluno com este endereço de e-mail',
            },
          ],
        });
      }
    }

    const student = await Student.findByPk(req.params.id);

    if (!student)
      return res.status(400).json({
        error: 'Ocorreu um erro:',
        messages: [{ path: 'id', message: 'Aluno não encontrado!' }],
      });

    await student.update(req.body);

    return res.json(student);
  }

  async destroy(req, res) {
    const { id } = req.params;
    const student = await Student.findByPk(id);

    if (!student)
      return res.status(400).json({
        error: 'Ocorreu um erro:',
        messages: [{ path: 'id', message: 'Aluno não encontrado!' }],
      });

    await student.destroy();
    return res.status(204).send();
  }
}

export default new StudentController();
