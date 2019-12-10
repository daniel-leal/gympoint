import * as Yup from 'yup';

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      email: Yup.string().email('E-mail inválido'),
      name: Yup.string(),
      age: Yup.number()
        .integer('Idade inválida')
        .positive('Idade inválida'),
      weight: Yup.number().positive('Peso inválido'),
      height: Yup.number().positive('Altura inválida'),
    });

    await schema.validate(req.body, { abortEarly: false });

    return next();
  } catch (err) {
    return res
      .status(400)
      .json({ error: 'Ocorreu um erro:', messages: err.inner });
  }
};
