import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class EnrollmentMail {
  get key() {
    return 'EnrollmentMail';
  }

  async handle({ data }) {
    const { enrollment, student, plan } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: '[MATRÍCULA REGISTRADA] - Gympoint',
      template: 'Enrollment',
      context: {
        student: student.name,
        plan: plan.title,
        start_date: format(
          parseISO(enrollment.start_date),
          "'dia' dd 'de' MMMM 'de' yyyy",
          {
            locale: pt,
          }
        ),
        end_date: format(
          parseISO(enrollment.end_date),
          "'dia' dd 'de' MMMM 'de' yyyy",
          {
            locale: pt,
          }
        ),
        total: enrollment.price,
      },
    });
  }
}

export default new EnrollmentMail();
