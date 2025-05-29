const leavetypesModel = require('../models/leavetypesModel');

exports.getAllLeaveTypes = async (request, h) => {
    try {
        const result = await leavetypesModel.getAllLeaveTypes();
        return h.response(result);
    } catch (error) {
        console.error("failed to get leavetypes ", error);
        return h.response({ error: 'Failes to get all leavetypes' }).code(500);
    }
}

// wo
exports.getLeaveTypeById = async (request, h) => {
    
    const { id } = request.params;
    try {
        const result = await leavetypesModel.getLeaveTypeById(id);
        if (result.length == 0) {
            return h.response({ error: 'Leave type is not found' }).code(404);
        }
        console.log(result)
        return h.response({ message: "successfully get the date" }).code(200);
    }catch (error) {
        console.error("Failed to get leavetypes", error);
        return h.response({ error: 'Failed to get leavetye' }).code(500);
    }
}

exports.addLeaveTypes = async (request, h) => {

    const { type_name, auto_approve, max_days } = request.payload;
    try {
        const result = await leavetypesModel.addLeaveTypes(type_name, auto_approve, max_days);
        return h.response({ message: "leavetype added successsully" }).code(200);
    }
    catch (error) {
        console.error("Failed to add leavetype", error);
        return h.response({ error: "Failed to add leavetype" }).code(500);
    }
}

exports.updateLeaveType = async (request, h) => {
    const { id } = request.params;
    const { type_name, auto_approve, max_days } = request.payload;
    try {
        const result = await leavetypesModel.updateLeaveType(type_name, auto_approve, max_days, id);
        if (result.affectedRows == 0) {
            return h.response({ error: 'leavetype is not found' }).code(404)
        }
        return h.response({ message: 'successfully update the leave type' }).code(200);
    } catch (error) {
        console.error('Fail to update leave type', error);
        return h.response({ error: 'Fail to update leave' }).code(500);
    }
}
exports.deleteLeaveType = async (request, h) => {
    const { id } = request.params;
    try {
        const result = await leavetypesModel.deleteLeaveType(id);
        if (result.affectedRows == 0) {
            return h.response({ error: 'leavetype is not found' }).code(404);
        }
        return h.response({ message: 'leavetype deleted successfully' }).code(200);
    } catch (error) {
        console.error('fail to delete', error);
        return h.response({ error: 'fail to delete the leavetype' }).code(500);
    }

}
