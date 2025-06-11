import * as leaverequestService from '../services/leaverequestService.js'
import * as leaveapprovalService from '../services/leaveapprovalsService.js';
import * as leavetypesService from '../services/leavetypesService.js';
import * as employeeService from '../services/employeeService.js';


export const addLeaverequest = async (request, h) => {
    const { employee_id, leavetype_id, start_date, end_date, reason, status, is_lop } = request.payload;
    try {
        const start = new Date(start_date);
        const end = new Date(end_date);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

        const data = {
            start_date,
            end_date,
            reason,
            status,
            days,
            is_lop,
            flag: true,
            employee_id: { employee_id }, // match relation name in entity
            leavetype_id: { leavetype_id } // match relation name in entity
        };

        const result = await leaverequestService.addLeaveRequest(data);
        console.log("result:", result);
        const request_id = result.request_id;
        console.log("request_id : ", request_id);

        const type = await leavetypesService.getLeaveTypeById(leavetype_id);
        const employee = await employeeService.getEmployeesById(employee_id);

        const managerId = employee.manager_id?.employee_id ?? null;
        const hrId = employee.hr_id?.employee_id ?? null;
        const directorId = employee.director_id?.employee_id ?? null;
        console.log("manager_id: ", employee.manager_id?.employee_id)
        console.log({ managerId, hrId, directorId });

        if (type.type_name.toLowerCase() === 'sick' && days === 1) {
            await leaveapprovalService.autoApprove({
                request_id,
                role: 'system',
                approver_id: null,
                status: 'approved'
            });

            await leaverequestService.updateLeaveRequestStatus(request_id, 'approved');
            return h.response({ message: 'Sick leave auto-approved' });
        } else if (days <= 2) {
            await leaveapprovalService.insertApproval({
                request_id,
                role: 'manager',
                approved_by: managerId,
                status: 'pending'
            });
        } else if (days <= 4) {
            await leaveapprovalService.insertApproval({
                request_id,
                role: 'manager',
                approved_by: managerId,
                status: 'pending'
            });
            await leaveapprovalService.insertApproval({
                request_id,
                role: 'hr',
                approved_by: hrId,
                status: 'inactive'
            });
        } else {
            await leaveapprovalService.insertApproval({
                request_id,
                role: 'manager',
                approved_by: managerId,
                status: 'pending'
            });
            await leaveapprovalService.insertApproval({
                request_id,
                role: 'hr',
                approved_by: hrId,
                status: 'inactive'
            });
            await leaveapprovalService.insertApproval({
                request_id,
                role: 'director',
                approved_by: directorId,
                status: 'inactive'
            });
        }

        return h.response({ message: 'Leave request submitted successfully' }).code(201);
    } catch (error) {
        console.error('Fail to add leave request', error);
        return h.response({ error: 'Fail to add leaverequest' }).code(500);
    }
};

export const getAllLeaverequest = async (request, h) => {
    try {
        const result = await leaverequestService.getAllLeaveRequests();
        return h.response(result).code(200);
    } catch (error) {
        console.error('Fail to get leaverequest', error);
        return h.response({ error: "Fail to get leaverequest" }).code(500);
    }
};

export const getLeaverequestById = async (request, h) => {
    const { req_id } = request.params;
    try {
        const result = await leaverequestService.getLeaveRequestById(req_id);
        if (result.length === 0) {
            return h.response({ error: "The Id is Not Found" }).code(404);
        }
        return h.response({ message: "Successfully retrieved" }).code(200);
    } catch (error) {
        console.log("Failed to get ", error);
        return h.response({ error: "Fail to get" }).code(500);
    }
};

// wo
export const getAllLeaverequestById = async (request, h) => {

    const { employee_id } = request.params;
    try {
        const result = await leaverequestService.getAllLeaveRequestByEmployeeId(employee_id);
        if (!result) {
            return h.response({ error: 'The employee ID was not found' }).code(404);
        }
        return h.response(result).code(200);
    } catch (error) {
        console.error("Fail to get leaverequest", error);
        return h.response({ error: "Fail to get leaverequest" }).code(500);
    }
};

export const cancelLeaverequest = async (request, h) => {
    const { req_id } = request.params;
    try {

        const leave = await leaverequestService.getLeaveRequestById(req_id);

        if (!leave) {
            return h.response({ error: 'Leave request not found' }).code(404);
        }

        const today = new Date();
        const startDate = new Date(leave.start_date);

        if (startDate > today) {
            await leaverequestService.cancelLeaveRequest(req_id);
            return h.response({ message: 'Leave cancelled and balance updated' }).code(200);
        } else {
            return h.response({ error: 'Leave cannot be cancelled after the start date' }).code(400);
        }
    } catch (error) {
        console.error('Cancel leave error:', error);
        return h.response({ error: 'Failed to cancel leave' }).code(500);
    }
};


export const usedLeavedaysEmployee = async (request, h) => {
    const { employee_id } = request.params;
    try {
        const result = await leaverequestService.usedLeaveDaysEmployee(employee_id);
        return h.response(result).code(200);
    } catch (error) {
        console.error("Error fetching used leave days", error);
        return h.response({ error: "Server error" }).code(500);
    }
};

export const getMappedLeaveRequests = async (request, h) => {
    const { role, id } = request.query;
    try {
        const rows = await leaveapprovalService.getRequestsForRoleMapped(role, id);
        return h.response(rows).code(200);
    } catch (error) {
        console.error("Error fetching mapped leave requests", error);
        return h.response({ error: "Server error" }).code(500);
    }
};

export const getApprovedStatus = async (request, h) => {
    try {
        const rows = await leaverequestService.getApprovedStatus();
        return h.response({ message: 'Successfully fetched', content: rows }).code(200);
    } catch (error) {
        console.error('Error fetching approved status:', error);
        return h.response({ error: 'Internal server error' }).code(500);
    }
};

export const approvedStatus = async (request, h) => {
    const employeeId = request.auth.employee_id;
    const { start, end } = request.query;

    try {
        const rows = await leaverequestService.getApprovedLeavesByEmployee(employeeId, start, end);
        return h.response({ message: "Leave requests fetched", result: rows }).code(200);
    } catch (error) {
        console.error("Error fetching leave data:", error);
        return h.response({ message: "Server error" }).code(500);
    }
};

export const dateOverlap = async (request, h) => {
    const { employee_id } = request.params;
    try {
        const result = await leaverequestService.dateOverlap(employee_id);
        return h.response({ message: "Successfully fetched", result }).code(200);
    } catch (error) {
        console.error("Error checking date overlap", error);
        return h.response({ message: 'Internal server error' }).code(500);
    }
};



export const getTeamLeavesByManagerController =async(request,h)=>{
    const id = request.auth.employee_id;

    const result=await employeeService.getEmployeesById(id);
    console.log("result",result);
  const {start, end } = request.query;
  const manager_id=result.manager_id.employee_id;
  console.log("manager_id",manager_id)
  if (!manager_id || !start || !end) {
    return h.response({ message: 'Missing required query parameters' }).code(400);
  }
  
  try {
    const leaves = await leaverequestService.getTeamLeavesByManager(manager_id, start, end);

    const formatted = leaves.map((leave) => ({
      request_id: leave.request_id,
      employee_name: leave.employee_id.name,
      leave_type: leave.leavetype_id.type_name,
      start_date: leave.start_date,
      end_date: leave.end_date,
      days: leave.days,
      reason: leave.reason
    }));

    return h.response(formatted).code(200);
  } catch (err) {
    console.error('Error fetching team calendar:', err);
    return h.response({ message: 'Internal server controller error' }).code(500);
  }

}