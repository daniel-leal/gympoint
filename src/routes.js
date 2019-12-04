import { Router } from 'express';

import SessionController from './app/controllers/SessionController';

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

export default routes;
