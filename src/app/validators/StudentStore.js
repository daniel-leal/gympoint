import * as Yup from 'yup';

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email('E-mail inválido')
        .required('E-mail é um campo obrigatório'),
      name: Yup.string()
        .required('Nome é um campo obrigatório')
        .min(3, 'Nome deve conter no mínimo 3 caracteres'),
      age: Yup.number()
        .integer('Idade inválida')
        .positive('Idade inválida')
        .required('Idade é um campo obrigatório'),
      weight: Yup.number()
        .positive('Peso inválido')
        .required('Peso é um campo obrigatório'),
      height: Yup.number()
        .positive('Altura inválida')
        .required('Altura é um campo obrigatório'),
    });

    await schema.validate(req.body, { abortEarly: false });

    return next();
  } catch (err) {
    return res
      .status(400)
      .json({ error: 'Ocorreu um erro:', messages: err.inner });
  }
};
