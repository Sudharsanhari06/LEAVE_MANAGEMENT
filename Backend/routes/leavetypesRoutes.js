const leavetypeController = require('../controllers/leavetypesController');
// const {verifyToken}=require('../middleware/authMiddleware')

const leavetypeRoutes =[
    {
        method: 'GET',
        path: '/leavetypes',
        handler: leavetypeController.getAllLeaveTypes
    },
    {
        method: 'GET',
        path: '/leavetypeById/{id}',
        handler: leavetypeController.getLeaveTypeById
    },
    {
        method: "POST",
        path: "/leavetype",
        handler: leavetypeController.addLeaveTypes
    },
    {
        method: 'PUT',
        path: "/leavetype/{id}/update",
        handler: leavetypeController.updateLeaveType
    }, {
        method: 'DELETE',
        path: '/leavetype/{id}/delete',
        handler: leavetypeController.deleteLeaveType
    }
]

module.exports = leavetypeRoutes;
