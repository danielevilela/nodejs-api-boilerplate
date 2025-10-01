import { Router } from 'express';
import { validate } from '../middleware/validate';
import { cacheMiddleware, invalidateCache } from '../middleware/cache';
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
router.get(
  '/:id',
  validate(getUserSchema),
  cacheMiddleware({ ttl: 600, keyPrefix: 'user' }), // Cache for 10 minutes
  (req, res) => {
    // In a real app, you would fetch the user from the database
    res.json({
      message: 'User retrieved successfully',
      userId: req.params.id,
      cached: res.get('X-Cache') === 'HIT',
    });
  }
);

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
router.patch('/:id', validate(updateUserSchema), async (req, res) => {
  // In a real app, you would update the user in the database

  // Invalidate related cache entries when user is updated
  try {
    await invalidateCache(`user:GET:/api/users/${req.params.id}*`);
    req.log?.info({ userId: req.params.id }, 'User cache invalidated');
  } catch (error) {
    req.log?.warn({ err: error, userId: req.params.id }, 'Cache invalidation failed');
  }

  res.json({
    message: 'User updated successfully',
    userId: req.params.id,
    updates: req.body,
  });
});

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (paginated)
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of users per page
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 */
router.get(
  '/',
  cacheMiddleware({ ttl: 300, keyPrefix: 'users_list' }), // Cache for 5 minutes
  (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    // Simulate user data
    const mockUsers = Array.from({ length: limit }, (_, i) => ({
      id: (page - 1) * limit + i + 1,
      username: `user${(page - 1) * limit + i + 1}`,
      email: `user${(page - 1) * limit + i + 1}@example.com`,
    }));

    res.json({
      message: 'Users retrieved successfully',
      users: mockUsers,
      pagination: {
        page,
        limit,
        total: 100, // Mock total
      },
      cached: res.get('X-Cache') === 'HIT',
    });
  }
);

export default router;
