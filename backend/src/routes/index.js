import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';

const router = Router();

// Health Check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Tech Zephyr API is up and running smoothly.',
    timestamp: new Date().toISOString(),
  });
});

// Main Route Handlers
router.use('/auth', authRoutes);
router.use('/users', userRoutes);

export default router;
