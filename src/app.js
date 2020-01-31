import './bootstrap';

import express from 'express';
import cors from 'cors';
import Youch from 'youch';
import io from 'socket.io';
import http from 'http';

import path from 'path';
import 'express-async-errors';

import routes from './routes';
import './database';

class App {
  constructor() {
    this.app = express();
    this.server = http.Server(this.app);
    this.socket();
    this.middlewares();
    this.routes();
    this.exceptionHandler();

    this.conectedStudents = {};
  }

  socket() {
    this.io = io(this.server);

    this.io.on('connection', socket => {
      const { student_id } = socket.handshake.query;
      this.conectedStudents[student_id] = socket.id;

      socket.on('disconect', () => {
        delete this.conectedStudents[student_id];
      });
    });
  }

  middlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cors());

    this.app.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );

    this.app.use((req, res, next) => {
      req.io = this.io;
      req.conectedStudents = this.conectedStudents;
      next();
    });
  }

  routes() {
    this.app.use(routes);
  }

  exceptionHandler() {
    this.app.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();

        return res.status(500).json(errors);
      }

      return res.status(500).json({ error: 'Ocorreu um erro interno' });
    });
  }
}

export default new App().server;
