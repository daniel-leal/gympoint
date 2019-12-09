import Plan from '../models/Plan';

class PlanController {
  async index(req, res) {
    const plans = await Plan.findAll({});

    return res.json(plans);
  }

  async get(req, res) {
    const plan = await Plan.findByPk(req.params.id);

    return plan ? res.json(plan) : res.send(204);
  }

  async store(req, res) {
    const { title } = req.body;

    const planExists = await Plan.findOne({ where: { title } });

    if (planExists) {
      return res.status(400).json({
        error: 'Ocorreu um erro:',
        messages: [{ path: '', message: 'Plano já existente' }],
      });
    }

    const plan = await Plan.create(req.body);

    return res.json(plan);
  }

  async update(req, res) {
    const { title } = req.body;

    const plan = await Plan.findByPk(req.params.id);

    if (!plan)
      return res.status(400).json({
        error: 'Ocorreu um erro:',
        messages: [{ path: 'id', message: 'Plano não encontrado!' }],
      });

    if (title !== plan.title) {
      const checkPlan = await Plan.findOne({ where: { title } });

      if (checkPlan)
        return res.status(400).json({
          error: 'Ocorreu um erro:',
          messages: [{ path: 'title', message: 'Plano já existente!' }],
        });
    }

    await plan.update(req.body);

    return res.json(plan);
  }

  async delete(req, res) {
    const plan = await Plan.findByPk(req.params.id);

    if (!plan)
      return res.status(400).json({
        error: 'Ocorreu um erro:',
        messages: [{ path: 'id', message: 'Plano não encontrado!' }],
      });

    await plan.destroy();

    return res.send(204);
  }
}

export default new PlanController();
