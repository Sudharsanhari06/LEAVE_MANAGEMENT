const leaveapprovalModel = require('../models/leaveapprovalsModel');
// const leavetypesModel = require('../models/leavetypesModel');
// const leaveUtil = require('../utils/leaveUtils');
// const leaverequestModel=require('../models/leaverequestModel');


exports.approveLeave = async (request, h) => {
    const { req_id } = request.params;
    const { approved_by, role, status } = request.payload;
    try {
        const result = await leaveapprovalModel.updateLeaveapproval(req_id, approved_by, role, status)
        return h.response({ message: `Leave request ${status} by ${role}` }).code(200);
    } catch (error) {
        console.error('Fail to approve the leave', error);
        return h.response({ error: 'Failed to approve ' }).code(500);
    }
}


// exports.applyLeave = async (request, h) => {
//     const { employee_id, leavetype_id, start_date, end_date, reason } = request.payload;
//     const leaveType = await leavetypesModel.getLeaveTypeById(leavetype_id);
//     const totalDays = leaveUtil.getLeaveDays(start_date, end_date);

//     const balance = await getLeaveBalance(employee_id, leavetype_id, new Date().getFullYear());
//     const availableLeave = (balance.allocated_days + balance.carry_forwarded) - balance.used_days;

//     let isLOP = false;
//     let status = 'pending';
//     let autoApprove = false;

//     if (leaveType.type_name.toLowerCase() === 'sick' || leaveType.type_name.toLowerCase() === 'emergency') {
//         if (availableLeave >= totalDays) {
//             status = 'approved';
//             autoApprove = true;
//         } else {
//             isLOP = true;
//             if (leaveType.type_name.toLowerCase() === 'emergency') {
//                 if (totalDays <= 1) status = 'approved';
//             } else if (leaveType.type_name.toLowerCase() === 'sick') {
//                 if (totalDays == 1) status = 'approved';
//                 else if (totalDays == 2) status = 'pending'; // HR approval needed
//                 else status = 'pending'; // Normal flow
//             }
//         }
//     }

//     const leaveResult = await leaverequestModel.addLeaverequest({ employee_id,leavetype_id,start_date,end_date,reason, status,isLOP});
//     if (autoApprove) {
//         // Insert leaveapproval rows for auto-approvers
//         await insertLeaveApproval({
//             request_id: leaveResult.insertId,
//             approved_by: 0, // system or auto
//             role: 'system',
//             status: 'approved'
//         });
//     }
//     return h.response({ message: `Leave ${status} successfull y`, request_id: leaveResult.insertId }).code(201);
// }






