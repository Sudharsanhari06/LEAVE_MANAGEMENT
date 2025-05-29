const database = require('../config/db');
exports.getAllLeaveTypes = async () => {
    const [result] = await database.query('SELECT leavetype_id,type_name,max_days FROM leavetypes WHERE isactive=true');
    return result;
}

// wo
exports.getLeaveTypeById = async (leavetype_id) => {
    const [result] = await database.query('SELECT * FROM leavetypes WHERE leavetype_id=? AND isactive=true', [leavetype_id]);
    return result;
}

exports.addLeaveTypes = async (type_name, auto_approve, max_days) => {
    const [result] = await database.query('INSERT INTO leavetypes (type_name,auto_approve,max_days) VALUES(?,?,?)', [type_name, auto_approve, max_days]);
    return result;
}

exports.updateLeaveType = async (type_name, auto_approve, max_days, id) => {
    const [result] = await database.query('UPDATE leavetypes SET type_name=? ,auto_approve=? ,max_days=? WHERE leavetype_id=?', [type_name, auto_approve, max_days, id])
    return result;
}

exports.deleteLeaveType = async (id) => {
    const result = await database.query('DELETE FROM leavetypes where leavetype_id=?', [id]);
    return result;
}