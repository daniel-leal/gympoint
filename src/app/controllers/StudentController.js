import Student from '../models/Student';

class StudentController {
  async index(req, res) {
    const students = await Student.findAll({});

    return res.json(students);
  }

  async get(req, res) {
    const student = await Student.findByPk(req.params.id);

    return student ? res.json(student) : res.send(204);
  }

  async store(req, res) {
    const student = await Student.create(req.body);

    return res.json(student);
  }

  async update(req, res) {
    const student = await Student.findByPk(req.params.id);

    if (!student)
      return res.status(400).json({
        error: 'Ocorreu um erro:',
        messages: [{ path: 'id', message: 'Aluno não encontrado!' }],
      });

    await student.update(req.body);

    return res.json(student);
  }

  async delete(req, res) {
    const student = await Student.findByPk(req.params.id);

    await student.destroy();

    return res.send(204);
  }
}

export default new StudentController();
