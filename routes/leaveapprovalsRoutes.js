const leaveapprovalController=require('../controllers/leaveapprovalsController');

const leaveapprovalRoutes=[
    {
     method:'PUT',
     path:'/leaverequest/{req_id}/leaveapproval',
     handler:leaveapprovalController.approveLeave
    }
];
module.exports=leaveapprovalRoutes;


