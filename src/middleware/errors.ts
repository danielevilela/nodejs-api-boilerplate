export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const createHttpError = (statusCode: number, message: string): AppError => {
  return new AppError(message, statusCode);
};

// Common HTTP errors
export const notFound = (message = 'Not Found'): AppError => createHttpError(404, message);
export const badRequest = (message = 'Bad Request'): AppError => createHttpError(400, message);
export const unauthorized = (message = 'Unauthorized'): AppError => createHttpError(401, message);
export const forbidden = (message = 'Forbidden'): AppError => createHttpError(403, message);
export const conflict = (message = 'Conflict'): AppError => createHttpError(409, message);
export const internalServer = (message = 'Internal Server Error'): AppError => 
  createHttpError(500, message);
