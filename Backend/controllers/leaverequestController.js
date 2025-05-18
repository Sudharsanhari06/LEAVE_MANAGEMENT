const leaverequestModel = require('../models/leaverequestModel');
const leaveapprovalModel = require('../models/leaveapprovalsModel');
const leavetypesModel = require('../models/leavetypesModel');
const database=require('../config/db');
// const leavebalanceModel = require('../models/leavebalanceModel');

exports.addLeaverequest = async (request, h) => {
    const { employee_id, leavetype_id, start_date, end_date, reason, status, is_lop, days } = request.payload;
    try {
        const result = await leaverequestModel.addLeaverequest(employee_id, leavetype_id, start_date, end_date, reason, status, is_lop, days);
        return h.response(result).code(200);
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
    const { req_id ,employee_id} = request.params;
    console.log("req_id",req_id);
    try {
        const [rows] = await database.query(
          `SELECT * FROM leaverequests WHERE request_id = ?`,
          [req_id]
        );
        const leave = rows[0];
        console.log("leave",leave);
    
        if (!leave) {
          return h.response({ error: 'Leave request not found' }).code(404);
        }
        const today = new Date();
        const startDate = new Date(leave.start_date);
        if (leave.status === 'approved' && startDate > today) {
          await leaverequestModel.cancelLeaverequest(req_id);
          await leaverequestModel.backUsedLeaveDays(
            leave.employee_id,
            leave.leavetype_id,
            leave.days
          );
    
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
        const diffDays = (end - start) / (1000 * 60 * 60 * 24) + 1;

        console.log('for console:', { leaveTypeName, diffDays });

        if ((leaveTypeName == 'sick' || leaveTypeName == 'emergency') && diffDays == 1) {
            console.log("Leave type:", leaveTypeName, "Days:", diffDays);

            const insertResult = await leaverequestModel.
                addLeaverequest({
                    employee_id,
                    leavetype_id,
                    start_date,
                    end_date,
                    reason,
                    status: 'approved',
                    is_lop
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
            }).code(200)
        } else {
            return h.response({ message: "This leave must go through approval process" }).code(202);
        }
    } catch (error) {
        console.error("Auto-approve failed", error);
        return h.response({ error: "Internal Server Error" }).code(500);
    }
}


