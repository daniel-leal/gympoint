import * as Yup from 'yup';

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      title: Yup.string().required('Título é um campo obrigatório'),
      duration: Yup.number()
        .integer('Duração inválida')
        .required('Duração é um campo obrigatório'),
      price: Yup.number()
        .positive('Preço inválido')
        .required('Preço é um campo obrigatório'),
    });

    await schema.validate(req.body, { abortEarly: false });

    return next();
  } catch (err) {
    return res
      .status(400)
      .json({ error: 'Ocorreu um erro:', messages: err.inner });
  }
};
