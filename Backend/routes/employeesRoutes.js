const employeesController = require('../controllers/employeesController');
const employeeRoutes = [
    {
        method: 'GET',
        path: '/employees',
        handler: employeesController.getAllEmployees
    },
    {
        method: 'GET',
        path: '/employees/{id}',
        handler: employeesController.getEmployeesById
    },
    {
        method: 'POST',
        path: '/employees',
        handler: employeesController.addEmployee
    },
    {
        method: 'PUT',
        path: '/employees/{id}/update',
        handler: employeesController.updateEmployee
    },
    {
        method: 'DELETE',
        path: '/employees/{id}/delete',
        handler: employeesController.deleteEmployee
    }
]
module.exports = employeeRoutes;



