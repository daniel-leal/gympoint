import Mail from '../../lib/Mail';

class HelpOrderMail {
  get key() {
    return 'HelpOrderMail';
  }

  async handle({ data }) {
    const { help_order } = data;

    await Mail.sendMail({
      to: `${help_order.student.name} <${help_order.student.email}>`,
      subject: 'Pedido de ajuda - [Resposta]',
      template: 'AnswerMail',
      context: {
        name: help_order.student.name,
        question: help_order.question,
        answer: help_order.answer,
      },
    });
  }
}

export default new HelpOrderMail();
