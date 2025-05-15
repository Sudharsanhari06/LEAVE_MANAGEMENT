const employeesController = require('../controllers/employeesController');
const {verifyToken, allowRoles}=require('../middleware/authMiddleware');



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
        options:{
            pre:[
                {method:verifyToken},
                {method:allowRoles('Hr')}
            ],
            handler: employeesController.addEmployee,
            payload: {
                parse: true,
                allow: 'application/json'
            }
        }
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
    },{
        method:'GET',
        path:'/employees/roles',
        options: {
            pre: [
              { method: verifyToken },
              { method: allowRoles('Hr','manager','Director') }
            ]
          },
          handler:employeesController.getUsersRoles,
    }
]
module.exports = employeeRoutes;



