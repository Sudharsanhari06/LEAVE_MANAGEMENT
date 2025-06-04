import * as leavetypesController from '../controllers/leavetypesController.js';
import { verifyToken } from '../middleware/authMiddleware.js';




export const leavetypesRoutes=[
    {
        method: 'GET',
        path: '/leavetypes',
        options:{
            pre:[
                {method:verifyToken}
            ]
        },
        handler: leavetypesController.getAllLeaveTypes
    },
    {
        method: 'GET',
        path: '/leavetypeById/{id}',
        options:{
            pre:[
                {method:verifyToken}
            ]
        },
        handler: leavetypesController.getLeaveTypeById
    },
    {
        method: "POST",
        path: "/leavetype",
        handler: leavetypesController.addLeaveType
    },
    {
        method: 'PUT',
        path: "/leavetype/{id}/update",
        handler: leavetypesController.updateLeaveType
    }, {
        method: 'DELETE',
        path: '/leavetype/{id}/delete',
        handler: leavetypesController.deleteLeaveType
    }
]

