const employeesController = require('../controllers/employeesController');
const employeeRoutes = [
    {
        method: 'GET',
        path: '/employees',
        handler: employeesController.getAllEmployees
    },
    {
        method: 'post',
        path: '/employees',
        handler: employeesController.addEmployee
    },
    {
        method: 'PUT',
        path: '/employees/{id}',
        handler: employeesController.updateEmployee
    },
    {
        method: 'DELETE',
        path: '/employees/{id}',
        handler: employeesController.deleteEmployee
    }
]
module.exports = employeeRoutes;



