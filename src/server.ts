import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database.config';
import { errorHandler } from './middleware/error-handler.middleware';
import { notFoundHandler } from './middleware/not-found.middleware';
import { rateLimiter } from './middleware/rate-limiter.middleware';
import movieRoutes from './routes/movie.routes';
import authRoutes from './routes/auth.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(rateLimiter);

app.use('/api/v1/movies', movieRoutes);
app.use('/api/v1/auth', authRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Movie Database API is running' });
});

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log(`📚 Movie Database API v${process.env.API_VERSION || '1.0.0'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
