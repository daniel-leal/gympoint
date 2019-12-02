import { Router } from 'express';

const routes = new Router();

/**
 * API Check
 */
routes.get('/', (req, res) => {
  res.json({ status: 'ok', version: '1.0', app: 'GymPoint' });
});

export default routes;
