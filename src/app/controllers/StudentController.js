import Student from '../models/Student';

class StudentController {
  async get(req, res) {
    const student = await Student.findByPk(req.params.id);

    return student ? res.json(student) : res.send(204);
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

    return res.json(student);
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
}

export default new StudentController();
