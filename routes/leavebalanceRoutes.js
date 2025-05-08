const leavebalanceController = require('../controllers/leavebalanceController');
const leavebalanceRoutes = [
    {
        method: 'POST',
        path: '/leavebalance',
        handler: leavebalanceController.addLeavebalance
    },
    {
        method: 'GET',
        path: '/leavebalance',
        handler: leavebalanceController.getAllLeavebalance
    },
    {
        method: 'GET',
        path: '/leavebalance/{id}',
        handler: leavebalanceController.getByIdLeavebalance
    },
    {
        method: 'DELETE',
        path: '/leavebalance/{id}',
        handler: leavebalanceController.deleteByIdLeavebalance
    },
    {
        method: 'PUT',
        path: '/leavebalance/{id}',
        handler: leavebalanceController.updateByIdLeavebalance
    },
    {
        method: 'GET',
        path: '/leavebalance/employee/{id}',
        handler: leavebalanceController.allLeavebalanceById
    }
]
module.exports = leavebalanceRoutes;
