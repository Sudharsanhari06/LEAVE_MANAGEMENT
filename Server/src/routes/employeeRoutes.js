import * as employeeController from '../controllers/employeeController.js';
import { verifyToken, allowRoles } from '../middleware/authMiddleware.js';

export const employeeRoutes = [
  {
    method: 'GET',
    path: '/employees',
    handler: employeeController.getAllEmployees
  },
  {
    method: 'GET',
    path: '/employees/{id}',
    handler: employeeController.getEmployeesById
  },

  {
    method: 'POST',
    path: '/employees',
    options: {
      pre: [
        { method: verifyToken },
        { method: allowRoles('hr') }
      ],
    },
    handler: employeeController.addEmployee

  },
  {
    method: 'PUT',
    path: '/employees/{id}',
    handler: employeeController.updateEmployee
  },
  {
    method: 'DELETE',
    path: '/employees/{id}/delete',
    handler: employeeController.deleteEmployee
  },
  {
    method: 'GET',
    path: '/employees/roles',
    options: {
      pre: [
        { method: verifyToken },
        { method: allowRoles('hr', 'manager', 'director') }
      ]
    },
    handler: employeeController.getUsersRoles
  },
  {
    method: 'GET',
    path: '/employees/manager/{managerId}',
    options: {
      pre: [
        { method: verifyToken }
      ]
    },
    handler: employeeController.getMangerbyEmployee
  }
];