import { Router } from 'express';

// Controllers
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import EnrollmentController from './app/controllers/EnrollmentController';
import CheckinController from './app/controllers/CheckinController';
import HelpOrderController from './app/controllers/HelpOrderController';
import AnswerController from './app/controllers/AnswerController';

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

import validateHelpOrderStore from './app/validators/HelpOrder/Store';

import validateAnswerStore from './app/validators/Answer/Store';

const routes = new Router();

/**
 * API Check
 */
routes.get('/', async (req, res) => {
  res.json({
    status: 'ok',
    version: '1.0.0',
    app: 'GymPoint',
    mode: process.env.NODE_ENV,
  });
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
 * Help Order
 */
routes.get('/students/:id/help-orders', HelpOrderController.index);
routes.post(
  '/students/:student_id/help-orders',
  validateHelpOrderStore,
  HelpOrderController.store
);

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
routes.delete('/students/:id', StudentController.destroy);

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
routes.get('/enrollments/:id', EnrollmentController.get);
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

/**
 * Answer
 */
routes.get('/help-orders', AnswerController.index);
routes.post(
  '/help-orders/:help_order_id/answer',
  validateAnswerStore,
  AnswerController.store
);

export default routes;
