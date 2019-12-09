import { Router } from 'express';

// Controllers
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import EnrollmentController from './app/controllers/EnrollmentController';

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
routes.get('/students/:id', StudentController.get);
routes.post('/students', validateStudentStore, StudentController.store);
routes.put('/students/:id', validateStudentUpdate, StudentController.update);

/**
 * Plan
 */
routes.get('/plans', PlanController.index);
routes.get('/plans/:id', PlanController.get);
routes.post('/plans', validatePlanStore, PlanController.store);
routes.put('/plans/:id', validatePlanUpdate, PlanController.update);
routes.delete('/plans/:id', PlanController.delete);

/**
 * Enrollments
 */
routes.get('/enrollments', EnrollmentController.index);
routes.post('/enrollments/:student_id/student', EnrollmentController.store);
routes.delete('/enrollments/:id', EnrollmentController.delete);

export default routes;
