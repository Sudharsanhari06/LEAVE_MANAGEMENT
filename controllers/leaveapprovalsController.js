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







