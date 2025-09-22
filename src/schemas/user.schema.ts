import { z } from 'zod';

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *       properties:
 *         username:
 *           type: string
 *           minLength: 3
 *           maxLength: 50
 *           example: johndoe
 *         email:
 *           type: string
 *           format: email
 *           example: john@example.com
 *     CreateUserInput:
 *       allOf:
 *         - $ref: '#/components/schemas/User'
 *         - type: object
 *           required:
 *             - password
 *           properties:
 *             password:
 *               type: string
 *               format: password
 *               minLength: 8
 *               example: Passw0rd
 *     UpdateUserInput:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           minLength: 3
 *           maxLength: 50
 *           example: johndoe
 *         email:
 *           type: string
 *           format: email
 *           example: john@example.com
 */

export const createUserSchema = z.object({
  body: z.object({
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(50, 'Username must be less than 50 characters'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
  }),
});

export const getUserSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid user ID'),
  }),
});

export const updateUserSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid user ID'),
  }),
  body: z.object({
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(50, 'Username must be less than 50 characters')
      .optional(),
    email: z.string().email('Invalid email address').optional(),
  }),
});
