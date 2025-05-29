const leaveapprovalController = require('../controllers/leaveapprovalsController');
// const leaveapprovalModel=require('../models/leaveapprovalsModel');
const { verifyToken, allowRoles } = require('../middleware/authMiddleware');

const leaveapprovalRoutes = [
    {
        method: 'GET',
        path: '/leaveapprovals/request/{req_id}',
        handler: leaveapprovalController.getAllapprovalById
    },
    {
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
    // wo
    {
        method: 'POST',
        path: '/leaveapproval/decision',
        options: {
            pre: [
                { method: verifyToken }
            ]
        },
        handler: leaveapprovalController.updateApprovalStatus
    },
    // wo
    {
        method:'GET',
        path: '/leaveapproval/status/{requestId}',
        handler: leaveapprovalController.getLeaveApprovalStatusByRequestId
    }
];
module.exports = leaveapprovalRoutes;


