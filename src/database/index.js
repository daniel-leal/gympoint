import Sequelize from 'sequelize';

import databaseConfig from '../config/database';

// Models
import User from '../app/models/User';
import Student from '../app/models/Student';
import Plan from '../app/models/Plan';
import Enrollment from '../app/models/Enrollment';

const models = [User, Student, Plan, Enrollment];

class Database {
  constructor() {
    this.connection = new Sequelize(databaseConfig);

    this.init();
    this.associate();
  }

  init() {
    models.map(model => model.init(this.connection));
  }

  associate() {
    models.forEach(model => {
      if (model.associate) {
        model.associate(this.connection.models);
      }
    });
  }
}

export default new Database();
