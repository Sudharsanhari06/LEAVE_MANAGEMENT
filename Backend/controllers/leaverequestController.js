const leaverequestModel = require('../models/leaverequestModel');
const leaveapprovalModel = require('../models/leaveapprovalsModel');
const leavetypesModel = require('../models/leavetypesModel');
const employeeModel=require('../models/employeesModel')


exports.addLeaverequest = async (request, h) => {
    const { employee_id, leavetype_id, start_date, end_date, reason, status, is_lop } = request.payload;

    try {
        const start = new Date(start_date);
        const end = new Date(end_date);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

        const result = await leaverequestModel.addLeaverequest(employee_id, leavetype_id, start_date, end_date, reason, status, is_lop, days);
        const request_id = result.insertId;



        const [type] = await leavetypesModel.getLeaveTypeById(leavetype_id);


        const[employee]=await employeeModel.getEmployeesById(employee_id)
        console.log(employee.id)
        if (type.type_name.toLowerCase() === 'sick' && days === 1) {
            await leaveapprovalModel.autoApprove({
                request_id,
                role: 'system',
                approver_id: null,
                status: 'approved'
            });
            await leaverequestModel.updateLeaveRequestStatus(request_id, 'approved');


            return h.response({ message: 'Sick leave auto-approved' });
        }
        else if (days <= 2) {
            await leaveapprovalModel.insertApproval({
                request_id,
                role: 'manager',
                approved_by: employee.manager_id,
                status: 'pending'
            });

        } else if (days <= 4) {
            await leaveapprovalModel.insertApproval({
                request_id,
                role: 'manager',
                approved_by: employee.manager_id,
                status: 'pending'
            });

            await leaveapprovalModel.insertApproval({
                request_id,
                role: 'hr',
                approved_by: employee.hr_id,
                status: 'inactive' // will activate after manager approves
            });

        } else {
            await leaveapprovalModel.insertApproval({
                request_id,
                role: 'manager',
                approved_by: employee.manager_id,
                status: 'pending'
            });

            await leaveapprovalModel.insertApproval({
                request_id,
                role: 'hr',
                approved_by: employee.hr_id,
                status: 'inactive'
            });

            await leaveapprovalModel.insertApproval({
                request_id,
                role: 'director',
                approved_by: employee.director_id,
                status: 'inactive'
            });
        }

        return h.response({ message: 'Leave request submitted successfully' }).code(201);

    } catch (error) {
        console.error('Fail to add leave request', error);
        return h.response({ error: 'Fail to add leaverequest' }).code(500);
    }
}

exports.getAllLeaverequest = async (request, h) => {
    try {
        const result = await leaverequestModel.getAllLeaverequest();
        return h.response(result).code(200);
    } catch (error) {
        console.error('Fail to get leaverequest', error);
        return h.response({ error: "Fail to get leaverequest" }).code(500);
    }
}

exports.getLeaverequestById = async (request, h) => {
    const { req_id } = request.params;
    try {
        const result = await leaverequestModel.getLeaverequestById(req_id);
        if (result.length == 0) {
            return h.response({ error: "The Id is Not Found" }).code(404)
        }
        return h.response({ message: "successfully get" }).code(200);
    } catch (error) {
        console.log("Failed to get ", error);
        return h.response({ error: "Fail to get" }).code(500);
    }
}


exports.getAllLeaverequestById = async (request, h) => {
    const { employee_id } = request.params;
    try {
        const result = await leaverequestModel.getAllLeaverequestById(employee_id);
        if (result.affectedRows == 0) {
            return h.response({ error: 'the Employee id is Not found' }).code(404)
        }
        return h.response(result).code(200);
    } catch (error) {
        console.error("Fail to get leaverequest", error);
        return h.response({ error: "Fail to get leaverequest" }).code(500)
    }
}


exports.cancelLeaverequest = async (request, h) => {
    const { req_id } = request.params;
    console.log("req_id", req_id);
    try {
        const result = await leaverequestModel.getLeaverequestById(req_id)
        const leave = result[0];
        console.log("leave", leave);
        if (!leave) {
            return h.response({ error: 'Leave request not found' }).code(404);
        }
        const today = new Date();
        const startDate = new Date(leave.start_date);
        if ((leave.status == 'approved' || leave.status == 'rejected' || leave.status == 'pending') && startDate > today) {
            await leaverequestModel.cancelLeaverequest(req_id);
            return h.response({ message: 'Leave cancelled and balance updated' }).code(200);

        } else {
            return h.response({ error: 'Leave cannot be cancelled after the start date' }).code(400);
        }
    } catch (error) {
        console.error('Cancel leave error:', error);
        return h.response({ error: 'Failed to cancel leave' }).code(500);
    }

}

exports.getLeaverequestIdDelete = async (request, h) => {
    const { req_id } = request.params;
    try {
        const result = await leaverequestModel.getLeaverequestIdDelete(req_id);
        return h.response({ message: "successfully deleted" }).code(200)
    } catch (error) {
        console.error("Failed to get leaverequest", error);
        return h.response({ error: "Failed to get leaverequest" }).code(500)
    }
}

exports.autoApproveLeave = async (request, h) => {
    const { employee_id, leavetype_id, start_date, end_date, reason, is_lop } = request.payload;
    try {
        const leaveType = await leavetypesModel.getLeaveTypeById(leavetype_id);
        if (!leaveType) {
            return h.response({ error: "Invalid leave type ID" }).code(400);
        }

        const leaveTypeName = leaveType[0].type_name?.toLowerCase();
        console.log("leaveTypeName", leaveTypeName)
        const start = new Date(start_date);
        const end = new Date(end_date);
        const days = (end - start) / (1000 * 60 * 60 * 24) + 1;

        console.log('for console:', { leaveTypeName, days });

        if ((leaveTypeName == 'sick') && days == 1) {
            console.log("Leave type:", leaveTypeName, "Days:", days);

            const insertResult = await leaverequestModel.
                addLeaverequest({
                    employee_id,
                    leavetype_id,
                    start_date,
                    end_date,
                    reason,
                    status: 'approved',
                    is_lop,
                    days
                });

            console.log("insertResult", insertResult);

            const request_id = insertResult.insertId;
            await leaveapprovalModel.autoApprove({
                request_id: request_id,
                role: 'system',
                status: 'approved'
            });

            return h.response({
                message: "Leave auto approved",
                request_id: request_id
            }).code(200);
        }

    } catch (error) {
        console.error("Auto-approve failed", error);
        return h.response({ error: "Internal Server Error" }).code(500);
    }
}


exports.usedLeavedaysEmployee = async (request, h) => {
    const { employee_id } = request.params;
    try {
        const result = await usedLeavedaysEmployee(employee_id);
        return result;
    } catch (error) {
        console.error("get the leave request some error")
    }
}



// exports.approveLeave = async (request, h) => {
//     const { id } = request.params;
//     const { decision, role, approver_id } = request.payload;

//     await leaveapprovalModel.updateApprovalStatus({ request_id: id, role, decision, approver_id });

//     if (decision === 'rejected') {
//         await leaveapprovalModel.updateLeaveRequestStatus(id, 'rejected');
//         return h.response({ message: 'Leave request rejected' });
//     }

//     const [reqRow] = await leaverequestModel.getLeaverequestById(id);

//     if (role === 'manager') {
//         if (reqRow.days <= 2) {
//             console.log("Manger approval..");
//             await leaverequestModel.updateLeaveRequestStatus(id, 'approved');
//         } else {
//             await leaveapprovalModel.activateNextRole(id, 'hr');
//         }
//     } else if (role === 'hr') {
//         if (reqRow.num_days <= 4) {
//             await leaverequestModel.updateLeaveRequestStatus(id, 'approved');
//         } else {
//             await leaveapprovalModel.activateNextRole(id, 'director');
//         }
//     } else if (role === 'director') {
//         await leaverequestModel.updateLeaveRequestStatus(id, 'approved');
//     }

//     return h.response({ message: 'Leave processed' });
// };




exports.getMappedLeaveRequests = async (request, h) => {
    const { role, id } = request.query;
    const rows = await leaveapprovalModel.getRequestsForRoleMapped(role, id);
    return h.response(rows).code(200);
};
