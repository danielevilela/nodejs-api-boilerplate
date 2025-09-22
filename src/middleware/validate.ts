import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { badRequest } from './errors';

export const validate =
  (schema: ZodSchema) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(
          badRequest(
            `Validation error: ${error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join(', ')}`
          )
        );
      }
      return next(error);
    }
  };
