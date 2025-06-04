
import { getDashboard } from '../controllers/dashboardController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

export const dashboardRoutes = [
  {
    method: 'GET',
    path: '/api/dashboard',
    options: {
      pre: [{ method: verifyToken }],
    },
    handler: getDashboard,
  },
];










