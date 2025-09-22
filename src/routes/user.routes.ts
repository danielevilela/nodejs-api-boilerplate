import { Router } from 'express';
import { validate } from '../middleware/validate';
import { createUserSchema, getUserSchema, updateUserSchema } from '../schemas/user.schema';

const router = Router();

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserInput'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/Error'
 */
router.post('/', validate(createUserSchema), (req, res) => {
  // In a real app, you would create the user in the database
  res.status(201).json({
    message: 'User created successfully',
    user: req.body,
  });
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User retrieved successfully
 *                 userId:
 *                   type: string
 *                   example: "123"
 *       404:
 *         $ref: '#/components/responses/Error'
 */
router.get('/:id', validate(getUserSchema), (req, res) => {
  // In a real app, you would fetch the user from the database
  res.json({
    message: 'User retrieved successfully',
    userId: req.params.id,
  });
});

/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: Update a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserInput'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User updated successfully
 *                 userId:
 *                   type: string
 *                   example: "123"
 *                 updates:
 *                   $ref: '#/components/schemas/UpdateUserInput'
 *       404:
 *         $ref: '#/components/responses/Error'
 */
router.patch('/:id', validate(updateUserSchema), (req, res) => {
  // In a real app, you would update the user in the database
  res.json({
    message: 'User updated successfully',
    userId: req.params.id,
    updates: req.body,
  });
});

export default router;
