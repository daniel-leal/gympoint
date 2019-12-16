import faker from 'faker';
import { factory } from 'factory-girl';

import User from '../src/app/models/User';
import Student from '../src/app/models/Student';
import Plan from '../src/app/models/Plan';
import Checkin from '../src/app/models/Checkin';
import HelpOrder from '../src/app/models/HelpOrder';
import Enrollment from '../src/app/models/Enrollment';

factory.define('User', User, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
});

factory.define('Student', Student, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  age: faker.random.number({ min: 1, max: 99 }),
  weight: faker.random.number({ min: 1, max: 400 }),
  height: faker.random.number({ min: 0, max: 3 }),
});

factory.define('Plan', Plan, {
  title: faker.lorem.word(),
  duration: faker.random.number({ min: 1, max: 24 }),
  price: faker.random.number({ min: 1, max: 150, precision: 2 ** -1 }),
});

factory.define('Checkin', Checkin, {
  student_id: faker.random.number({ min: 1 }),
});

factory.define('HelpOrder', HelpOrder, {
  student_id: faker.random.number({ min: 1 }),
  question: faker.lorem.word(),
});

factory.define('Enrollment', Enrollment, {
  student_id: faker.random.number({ min: 1 }),
  plan_id: faker.random.number({ min: 1 }),
  start_date: new Date(),
  end_date: new Date(),
  price: faker.random.number({ min: 1, max: 500, precision: 2 ** -1 }),
});

export default factory;
