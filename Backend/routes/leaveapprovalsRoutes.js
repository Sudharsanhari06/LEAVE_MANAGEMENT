const leaveapprovalController = require('../controllers/leaveapprovalsController');
// const leaveapprovalModel=require('../models/leaveapprovalsModel');
const { verifyToken, allowRoles } = require('../middleware/authMiddleware');

const leaveapprovalRoutes = [
    {
        method: 'PUT',
        path: '/leaverequest/{req_id}/leaveapproval',
        handler: leaveapprovalController.approveLeave
    }
    ,{
        method: 'GET',
        path: '/leaveapprovals/request/{req_id}',
        handler: leaveapprovalController.getAllapprovalById
    }, {
        method: 'GET',
        path: '/leaveapprovals/request/employee/{emp_id}',
        handler: leaveapprovalController.getAllapprovalByEmployeeId
    }

    , {
        method: 'GET',
        path: '/leaveapproval/mapped',
        options: {
            pre: [
                { method: verifyToken }
            ]
        },
        handler: leaveapprovalController.getMappedLeaveRequests
    },
    {
        method: 'GET',
        path: '/leaveapproval/decision',
        options: {
            pre: [
                { method: verifyToken }
            ]
        },
        handler: leaveapprovalController.updateApprovalStatus
    }

];
module.exports = leaveapprovalRoutes;


