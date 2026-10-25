import dotenv from 'dotenv';
dotenv.config();

console.log(process.env.MONGO_URI, process.env.NEBIUS_API_KEY);

import express from 'express';
import router from './routes/index.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler, errorHandler } from './middleware/error.js';
import mongoose from 'mongoose';

const app = express();

app.use(express.json());
app.use(logger);

app.get('/health', (req, res): void => {
  res.status(200).json({
    success: true,
    data: { status: 'ok' },
    error: null,
  });
});

app.get('/test-error', () => {
  throw new Error('Test error');
});

app.use(router);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Connection error', err);
  });
