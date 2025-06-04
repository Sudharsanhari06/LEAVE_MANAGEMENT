
import { AppDataSource } from '../config/db.js'
import { LeaveApprovals } from '../entities/LeaveApprovals.js';
import { LeaveRequest } from '../entities/LeaveRequest.js';
import * as leaveapprovalsService from '../services/leaveapprovalsService.js';


export const getAllapprovalById = async (request, h) => {
    const { req_id } = request.params;
    try {
        const result = await AppDataSource.getRepository(LeaveApprovals).find({
            where: { request: { id: req_id } },
            relations: ['request'],
        });

        if (!result.length) {
            return h.response({ error: "The ID is Not Found" }).code(404);
        }

        return h.response({ message: "Successfully fetched", data: result }).code(200);
    } catch (error) {
        console.error("Failed to get by ID", error);
        return h.response({ error: 'Failed to get the value' }).code(500);
    }
};

export const getAllapprovalByEmployeeId = async (request, h) => {
    const { emp_id } = request.params;
    try {
        const result = await AppDataSource.getRepository(LeaveApprovals).find({
            where: { approved_by: emp_id },
            relations: ['request'],
        });

        if (!result.length) {
            return h.response({ error: "The employee ID is not found" }).code(404);
        }

        return h.response({ message: "Successfully fetched", data: result }).code(200);
    } catch (error) {
        console.error("Failed to get by employee ID", error);
        return h.response({ error: 'Failed to get employee ID' }).code(500);
    }
};

//wo
export const getMappedLeaveRequests = async (request, h) => {
    const { role, approved_by } = request.query;

    try {
        const rows = await leaveapprovalsService.getMappedRequestsService({ role, approved_by });
        return h.response(rows).code(200);
    } catch (err) {
        console.error('Error in controller:', err);
        return h.response({ error: 'Failed to fetch leave requests' }).code(500);
    }
};


export const updateApprovalStatus = async (request, h) => {
    const { request_id, role, decision, approved_by, reason } = request.payload;
    try {
        const result = await leaveapprovalsService.updateApprovalStatus({
            request_id,
            role,
            decision,
            approved_by,
            reason,
        });

        if (result?.error) {
            return h.response({ error: result.error }).code(404);
        }
        return h.response({ message: `Leave ${decision} successfully` }).code(200);
    } catch (err) {
        console.error("Failed to update approval status", err);
        return h.response({ error: "Failed to update approval status" }).code(500);
    }
};


export const getLeaveApprovalStatusByRequestId = async (request, h) => {
    const { requestId } = request.params;
    console.log("request_id approval", requestId);
    try {
        const result = await leaveapprovalsService.getLeaveApprovalStatusByRequestId(requestId);
        return h.response(result).code(200);
    } catch (error) {
        console.error("Error fetching approval status:", error);
        return h.response({ error: 'Failed to fetch approval status' }).code(500);
    }
};


export const getRejectApproval=async(request,h)=>{
    
}