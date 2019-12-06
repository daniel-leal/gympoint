import { Router } from 'express';

// Controllers
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';

// Middlewares
import authMiddleware from './app/middlewares/auth';

// Validators
import validateStudentStore from './app/validators/StudentStore';
import validateStudentUpdate from './app/validators/StudentUpdate';
import validatePlanStore from './app/validators/PlanStore';
import validatePlanUpdate from './app/validators/PlanUpdate';

const routes = new Router();

/**
 * API Check
 */
routes.get('/', (req, res) => {
  res.json({ status: 'ok', version: '1.0', app: 'GymPoint' });
});

/**
 * Session
 */
routes.post('/sessions', SessionController.store);

/**
 * Logged users
 */
routes.use(authMiddleware);

/**
 * Student
 */
routes.get('/students', StudentController.index);
routes.get('/students/:id', StudentController.get);
routes.post('/students', validateStudentStore, StudentController.store);
routes.put('/students/:id', validateStudentUpdate, StudentController.update);
routes.delete('/students/:id', StudentController.delete);

/**
 * Plan
 */
routes.get('/plans', PlanController.index);
routes.get('/plans/:id', PlanController.get);
routes.post('/plans', validatePlanStore, PlanController.store);
routes.put('/plans/:id', validatePlanUpdate, PlanController.update);
routes.delete('/plans/:id', PlanController.delete);

export default routes;
