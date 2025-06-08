// server.js
import 'dotenv/config';
import Hapi from '@hapi/hapi';
import { AppDataSource } from './config/db.js';

import { employeeRoutes } from './routes/employeeRoutes.js';
import { leavetypesRoutes } from './routes/leavetypesRoutes.js';
import { leavebalanceRoutes } from './routes/leavebalanceRoutes.js';
import { leaveReaquestRoutes } from './routes/leaverequestRoutes.js';
import { leaveapprovalsRoutes } from './routes/leaveapprovalsRoutes.js';
import { authRoutes } from './routes/authRoutes.js';
import {dashboardRoutes} from './routes/dashboardRoutes.js'
import { holidaysRoutes } from './routes/holidaysRoutes.js';

const init = async () => {
  const server = Hapi.server({
    port: 3006,
    host: process.env.DB_HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  try {
    await AppDataSource.initialize();
    console.log('Data Source initialized');

    // Register all routes
    server.route(employeeRoutes);
    server.route(leavetypesRoutes);
    server.route(leavebalanceRoutes);
    server.route(leaveReaquestRoutes);
    server.route(leaveapprovalsRoutes);
    server.route(holidaysRoutes);
    server.route([...authRoutes,...dashboardRoutes]);

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
  } catch (error) {
    console.error('Failed to initialize Data Source or start server:', error);
  }
};

init();
