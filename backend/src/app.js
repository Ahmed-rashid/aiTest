import express from 'express';
import { apiRouter } from './routes/api.js';
import { ApiError } from './utils/errors.js';

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use('/api', apiRouter);

  app.use((req, res) => {
    res.status(404).json({ message: `Route not found: ${req.method} ${req.url}` });
  });

  app.use((error, _req, res, _next) => {
    if (error instanceof ApiError) {
      return res.status(error.status).json({ message: error.message, details: error.details ?? null });
    }

    return res.status(500).json({
      message: 'Unexpected server error',
      details: error instanceof Error ? error.message : String(error)
    });
  });

  return app;
}
