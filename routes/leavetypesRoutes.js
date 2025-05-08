const leavetypeController = require('../controllers/leavetypesController');
const leavetypeRoutes = [
    {
        method: 'GET',
        path: '/leavetype',
        handler: leavetypeController.getAllLeaveTypes
    },
    {
        method: "POST",
        path: "/leavetype",
        handler: leavetypeController.addLeaveTypes
    },
    {
        method: 'PUT',
        path: "/leavetype/{id}",
        handler: leavetypeController.updateLeaveType
    }, {
        method: 'DELETE',
        path: '/leavetype/{id}',
        handler: leavetypeController.deleteLeaveType
    }
]

module.exports = leavetypeRoutes;
