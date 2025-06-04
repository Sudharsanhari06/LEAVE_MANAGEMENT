import * as leaveapprovalController from '../controllers/leaveapprovalsController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

export const leaveapprovalsRoutes = [
    {
        method: 'GET',
        path: '/leaveapprovals/request/{req_id}',
        handler: leaveapprovalController.getAllapprovalById
    },
    {
        method: 'GET',
        path: '/leaveapprovals/request/employee/{emp_id}',
        handler: leaveapprovalController.getAllapprovalByEmployeeId
    },

    //required
    {
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
        method: 'POST',
        path: '/leaveapproval/decision',
        options: {
            pre: [
                { method: verifyToken }
            ]
        },
        handler: leaveapprovalController.updateApprovalStatus
    },
    {
        method: 'GET',
        path: '/leaveapproval/status/{requestId}',
        options: {
            pre: [
                { method: verifyToken }
            ]
        },
        handler: leaveapprovalController.getLeaveApprovalStatusByRequestId
    },{
        method:'GET',
        path: '/leaveapproval/reject',
        options: {
            pre: [
                { method: verifyToken }
            ]
        },
        handler:leaveapprovalController.getRejectApproval
    }
];


