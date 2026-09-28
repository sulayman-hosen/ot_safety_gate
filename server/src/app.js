import express from 'express';
import sessionRoutes from './routes/sessionRoutes.js';
import clinicalCaseRoutes from './routes/clinicalCaseRoutes.js';
import checklistRecordRoutes from './routes/checklistRecordRoutes.js';
import smartLaunchRoutes from './routes/smartLaunchRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.disable('etag');
  app.use((request, response, next) => {
    response.set({ 'Cache-Control': 'no-store, private', Pragma: 'no-cache', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer' });
    next();
  });
  app.use(express.json({ limit: '16kb', strict: true }));
  app.use('/api', healthRoutes, sessionRoutes, clinicalCaseRoutes, checklistRecordRoutes);
  app.use(smartLaunchRoutes);
  app.use((request, response) => response.status(404).json({ error: 'Endpoint not found.', code: 'NOT_FOUND' }));
  app.use(errorHandler);
  return app;
}
