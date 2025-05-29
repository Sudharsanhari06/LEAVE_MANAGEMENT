const leaveapprovalModel = require('../models/leaveapprovalsModel');
const leaverequestModel = require('../models/leaverequestModel');


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
    console.log("con role", role, "con approved", approved_by)
    const rows = await leaveapprovalModel.getMappedRequests({ role, approved_by });
    return h.response(rows).code(200);
};




exports.updateApprovalStatus = async (request, h) => {

    const { request_id, role, decision, approved_by, reason } = request.payload;
    try {
        await leaveapprovalModel.updateApprovalStatus({ request_id, role, decision, approved_by, reason });

        if (decision === 'approved') {
            if (role === 'manager') {
                const approvals = await leaveapprovalModel.getAllapprovalById(request_id);
                const hrApproval = approvals.find(a => a.role === 'hr');
                const directorApproval = approvals.find(a => a.role === 'director');

                if (!hrApproval && !directorApproval) {
                    await leaverequestModel.updateLeaveRequestStatus(request_id, 'approved');
                } else {
                    await leaveapprovalModel.activateNextRole(request_id, 'hr');
                }

            } else if (role === 'hr') {
                const approvals = await leaveapprovalModel.getAllapprovalById(request_id);
                const directorApproval = approvals.find(a => a.role === 'director');

                if (!directorApproval) {
                    console.log("not directorApproval");

                    await leaverequestModel.updateLeaveRequestStatus(request_id, 'approved');

                } else {
                    await leaveapprovalModel.activateNextRole(request_id, 'director');
                }
            } else if (role === 'director') {
                await leaverequestModel.updateLeaveRequestStatus(request_id, 'approved');
            }
        } else if (decision === 'rejected') {
            await leaverequestModel.updateLeaveRequestStatus(request_id, 'rejected');
        }

        return h.response({ message: `Leave ${decision} successfully` });
    } catch (error) {
        console.error(error);
        return h.response({ error: 'Failed to update approval status' }).code(500);
    }
};


// wo
exports.getLeaveApprovalStatusByRequestId = async (request, h) => {
    try {
        const { requestId } = request.params;
        const result = await leaveapprovalModel.getLeaveApprovalStatusByRequestId(requestId);
        return h.response(result).code(200);
    } catch (error) {
        console.error("Error fetching approval status:", error);
        return h.response({ error: 'Failed to fetch approval status' }).code(500);
    }
}