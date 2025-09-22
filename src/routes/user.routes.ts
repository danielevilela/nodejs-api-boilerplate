import { Router } from 'express';
import { validate } from '../middleware/validate';
import { createUserSchema, getUserSchema, updateUserSchema } from '../schemas/user.schema';

const router = Router();

// Example user routes with validation
router.post('/', validate(createUserSchema), (req, res) => {
  // In a real app, you would create the user in the database
  res.status(201).json({
    message: 'User created successfully',
    user: req.body,
  });
});

router.get('/:id', validate(getUserSchema), (req, res) => {
  // In a real app, you would fetch the user from the database
  res.json({
    message: 'User retrieved successfully',
    userId: req.params.id,
  });
});

router.patch('/:id', validate(updateUserSchema), (req, res) => {
  // In a real app, you would update the user in the database
  res.json({
    message: 'User updated successfully',
    userId: req.params.id,
    updates: req.body,
  });
});

export default router;
