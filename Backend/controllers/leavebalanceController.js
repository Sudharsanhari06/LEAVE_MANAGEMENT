const leavebalanceModel = require('../models/leavebalanceModel');

exports.getAllLeavebalance = async (request, h) => {
    try {
        const result = await leavebalanceModel.getAllLeavebalance();
        return h.response(result).code(200);
    }catch(error) {
        console.error("Fail to get all leavebalance", error);
        return h.response(
            { error: 'Fail to get all leavebalance' }
        ).code(500)
    }
}

exports.getByIdLeavebalance = async (request, h) => {
    const { id } = request.params;
    try {
        const result = await leavebalanceModel.getByIdLeavebalance(id);
        if (result.length == 0) {
            return h.response({ error: "leavebalance is Not Found" }).code(404);
        }
        return h.response({ message: "leavebalance get successfully" }).code(200);
    } catch (error) {
        console.error("Fail to get leavebalance", error);
        return h.response({
            error: "Fail to get leavebalance"
        }).code(500);
    }
}

exports.addLeavebalance = async (request, h) => {
    const { employee_id, leavetype_id, year, allocated_days, used_days, carry_forwarded } = request.payload;
    try {
        const result = await leavebalanceModel.addLeavebalance(employee_id, leavetype_id, year, allocated_days, used_days, carry_forwarded);
        return h.response({ message: "leavebalance successfully added" }).code(200);
    } catch (error) {
        console.error('Fail to add leavebalance', error);
        return h.response({
            error: "Fail to add leavebalance"
        }).code(500);
    }
}

exports.updateByIdLeavebalance = async (request, h) => {
    const { id } = request.params;
    const { employee_id, leavetype_id, year, allocated_days, used_days, carry_forwarded } = request.payload;

    try {
        const result = await leavebalanceModel.updateByIdLeavebalance(employee_id, leavetype_id, year, allocated_days, used_days, carry_forwarded, id);
        return h.response({ message: 'the leave balance update successfully' }).code(200)
    } catch (error) {
        console.error("Fail to update leave balance", error);
        return h.response({ error: 'Fail to update ' }).code(500);
    }

}

exports.deleteByIdLeavebalance = async (request, h) => {
    const { id } = request.params;
    try {
        const result = await leavebalanceModel.deleteByIdLeavebalance(id);
        if (result.affectedRows == 0) {
            return h.response({
                error: "leavebalance id Not found"
            }).code(404);
        }
        return h.response({ message: "leavebalance deleted successfully" }).code(200)
    } catch (error) {
        console.error("Fail to delete the leavebalance", error);
        return h.response({ error: "Fail to leavebalance" }).code(500);
    }
}


exports.allLeavebalanceById = async (request, h) => {
    const { employee_id } = request.params;
    const currentYear=new Date().getFullYear();

    try {
        const result = await leavebalanceModel.allLeavebalanceById(employee_id,currentYear);

        const totalAvailable = result.reduce((sum, row) => sum + row.available_days, 0);


        return h.response({
            employee_id: employee_id,
            total_available_days: totalAvailable,
            leave_types: result
          }).code(200);

        // return h.response(result).code(200);
    } catch (error) {
        console.error("Fail to get leavebalance", error);
        return h.response({ error: "Fail to get leavebalance" }).code(500);
    }
}






