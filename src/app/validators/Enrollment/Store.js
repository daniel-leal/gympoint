import * as Yup from 'yup';

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      plan_id: Yup.number()
        .integer('Id do plano inválido')
        .required('Id do plano é um campo obrigatório'),
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
