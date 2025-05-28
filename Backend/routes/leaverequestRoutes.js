const leaverequestController = require('../controllers/leaverequestController');
const { verifyToken } = require('../middleware/authMiddleware');

const leaverequestRoutes = [
    {
        method: 'POST',
        path: '/leaverequest',
        options: {
            pre: [
                { method: verifyToken }
            ]
        },
        handler: leaverequestController.addLeaverequest
    }
      ,{
        method: 'GET',
        path: '/leaverequest',
        handler: leaverequestController.getAllLeaverequest
    },
    {
        method: 'GET',
        path: '/leaverequest/{req_id}',
        handler: leaverequestController.getLeaverequestById
    },
    {  
        method: 'GET',
        path: '/leaverequest/employee/{employee_id}',
        options: {
            pre: [
                { method: verifyToken }
            ]
        },
        handler: leaverequestController.getAllLeaverequestById
    },
    {
        method: 'PUT',
        path: '/employee/leaverequest/{req_id}',
        options: {
            pre: [
                { method: verifyToken }
            ]
        },
        handler: leaverequestController.cancelLeaverequest
    }
    , {
        method: 'DELETE',
        path: '/leaverequest/{req_id}/delete',
        handler: leaverequestController.getLeaverequestIdDelete
    }, {
        method: 'POST',
        path: '/leaverequest/auto-approve',
        handler: leaverequestController.autoApproveLeave
    },{
        method: 'GET',
        path: '/leaverequest/status',
        handler: leaverequestController.getApprovedStatus
    },{
        method: 'GET',
        path: '/leaverequest/statusapproved',
        options:{
            pre:[
                {method:verifyToken}
            ]
        },
        handler:leaverequestController.approvedStatus
    },{
        method:'GET',
        path:'/leaverequest/date-overlap/{employee_id}',
        options:{
            pre:[
                {method:verifyToken}
            ]
        },
        handler:leaverequestController.dateOverlap
    }
]
module.exports = leaverequestRoutes;




