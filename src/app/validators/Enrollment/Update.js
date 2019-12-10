import * as Yup from 'yup';

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      student_id: Yup.number().integer('Id do aluno inválido'),
      plan_id: Yup.number().integer('Id do plano inválido'),
      start_date: Yup.date('Data de início inválida').required(
        'Data de início é um campo obrigatório'
      ),
    });

    await schema.validate(req.body, { abortEarly: false });

    return next();
  } catch (err) {
    return res
      .status(400)
      .json({ error: 'Ocorreu um erro:', messages: err.inner });
  }
};
