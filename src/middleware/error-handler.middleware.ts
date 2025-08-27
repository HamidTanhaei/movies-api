import { Request, Response, NextFunction } from 'express';

export interface ApiError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  error: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  console.error(`❌ Error ${statusCode}: ${message}`);
  console.error(error.stack);

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      statusCode,
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method
    }
  });
};

export const createError = (message: string, statusCode: number = 500): ApiError => {
  const error = new Error(message) as ApiError;
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};

export const notFoundError = (resource: string = 'Resource'): ApiError => {
  return createError(`${resource} not found`, 404);
};

export const validationError = (message: string): ApiError => {
  return createError(message, 400);
};

export const unauthorizedError = (message: string = 'Unauthorized'): ApiError => {
  return createError(message, 401);
};

export const forbiddenError = (message: string = 'Forbidden'): ApiError => {
  return createError(message, 403);
};
