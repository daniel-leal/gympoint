import * as Yup from 'yup';

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email('E-mail inválido')
        .required('E-mail é um campo obrigatório'),
      password: Yup.string().required('Senha é um campo obrigatório'),
    });

    await schema.validate(req.body, { abortEarly: false });

    return next();
  } catch (err) {
    return res
      .status(400)
      .json({ error: 'Ocorreu um erro:', messages: err.inner });
  }
};
