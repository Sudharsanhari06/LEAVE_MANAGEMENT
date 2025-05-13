const leaveapprovalController = require('../controllers/leaveapprovalsController');

const leaveapprovalRoutes = [
    {
        method: 'PUT',
        path: '/leaverequest/{req_id}/leaveapproval',
        handler: leaveapprovalController.approveLeave
    }
    // {
    //     method: 'POST',
    //     path: '/leaverequest/approvelevel',
    //     handler: leaveapprovalController
    // }
    ,{
        method: 'GET',
        path: '/leaveapprovals/request/{req_id}',
        handler: leaveapprovalController.getAllapprovalById
    },{
        method: 'GET',
        path: '/leaveapprovals/request/employee/{emp_id}',
        handler: leaveapprovalController.getAllapprovalByEmployeeId
    }
];
module.exports = leaveapprovalRoutes;


