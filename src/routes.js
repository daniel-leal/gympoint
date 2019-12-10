import { Router } from 'express';

// Controllers
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import EnrollmentController from './app/controllers/EnrollmentController';
import CheckinController from './app/controllers/CheckinController';

// Middlewares
import authMiddleware from './app/middlewares/auth';

// Validators
import validateSessionStore from './app/validators/Session/Store';

import validateStudentStore from './app/validators/Student/Store';
import validateStudentUpdate from './app/validators/Student/Update';

import validatePlanStore from './app/validators/Plan/Store';
import validatePlanUpdate from './app/validators/Plan/Update';

import validateEnrollmentStore from './app/validators/Enrollment/Store';
import validateEnrollmentUpdate from './app/validators/Enrollment/Update';

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
routes.post('/sessions', validateSessionStore, SessionController.store);

/**
 * Checkin
 */
routes.get('/students/:student_id/checkins', CheckinController.index);
routes.post('/students/:student_id/checkins', CheckinController.store);

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
 * Enrollment
 */
routes.get('/enrollments', EnrollmentController.index);
routes.post(
  '/enrollments/:student_id/student',
  validateEnrollmentStore,
  EnrollmentController.store
);
routes.put(
  '/enrollments/:id/student',
  validateEnrollmentUpdate,
  EnrollmentController.update
);
routes.delete('/enrollments/:id', EnrollmentController.delete);

export default routes;
