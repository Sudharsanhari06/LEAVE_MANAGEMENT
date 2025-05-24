
const leaveapprovalModel = require('../models/leaveapprovalsModel');

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

exports.getAllapprovalById = async (request, h) => {
    const { req_id } = request.params;
    try {
        const result = await leaveapprovalModel.getAllapprovalById(req_id);
        if (result.length == 0) {
            return h.response({ error: "The ID is Not Found" }).code(404)
        }
        return h.response({ message: "successfully get", data: result[0] }).code(200);
    } catch (error) {
        console.error("Failed to get Id", error);
        return h.response({ error: 'Failed to get the value' }).code(500);
    }
}


exports.getAllapprovalByEmployeeId = async (request, h) => {
    const { emp_id } = request.params;
    try {
        const result = await leaveapprovalModel.getAllapprovalByEmployeeId(emp_id);
        if (result.length == 0) {
            return h.response({ error: "The employee id is Not Found" }).code(404)
        }
        return h.response({ message: "Suuccessfully get the employee Id", data: result[0] }).code(200)
    } catch (error) {
        console.error("Failed to get Employee Id", error);
        return h.response({ error: "Failed to get employee Id" }).code(500);
    }
}


exports.getMappedLeaveRequests = async (request, h) => {
    const { role, approved_by } = request.query;
    console.log("con role",role,"con approved",approved_by)
    const rows = await leaveapprovalModel.getMappedRequests({role, approved_by});
    return h.response(rows).code(200);
};

exports.updateApprovalStatus = async (request, h) => {
    const { request_id, role, decision, approved_by } = request.payload;

    try {
        await leaveapprovalModel.updateApprovalStatus({ request_id, role, decision, approved_by });

        // if decision is approved, activate next level if it exists
        if (decision === 'approved') {
            if (role === 'manager') {
                await leaveapprovalModel.activateNextRole(request_id, 'hr');
            } else if (role === 'hr') {
                await leaveapprovalModel.activateNextRole(request_id, 'director');
            }
        }

        return h.response({ message: `Leave ${decision} successfully` });
    } catch (error) {
        console.error(error);
        return h.response({ error: 'Failed to update approval status' }).code(500);
    }
};
