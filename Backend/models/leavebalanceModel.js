const database = require('../config/db');
// const leaverequestModel=require('./leaverequestModel');

exports.getAllLeavebalance = async () => {
    const [result] = await database.query('SELECT * FROM leavebalances');
    return result;
}

exports.getByIdLeavebalance = async (id) => {
    const [result] = await database.query('SELECT * FROM leavebalances WHERE balance_id=?', [id]);
    return result;
}

exports.addLeavebalance = async (employee_id, leavetype_id, year, allocated_days, used_days, carry_forwarded) => {
    const [result] = await database.query('INSERT INTO leavebalances (employee_id,leavetype_id,year,allocated_days,used_days,carry_forwarded) VALUES(?,?,?,?,?,?)', [employee_id, leavetype_id, year, allocated_days, used_days, carry_forwarded]);
    return result;
}

exports.updateByIdLeavebalance = async (employee_id, leavetype_id, year, allocated_days, used_days, carry_forwarded, id) => {
    const [result] = await database.query('UPDATE leavebalances SET employee_id=? ,leavetype_id=? ,year=? ,allocated_days=? ,used_days=? ,carry_forwarded=? WHERE balance_id=?', [employee_id, leavetype_id, year, allocated_days, used_days, carry_forwarded, id])
    return result;
}

exports.deleteByIdLeavebalance = async (id) => {
    const [result] = await database.query('DELETE FROM leavebalances WHERE balance_id=?', [id]);
    return result;
}

exports.allLeavebalanceById = async (employee_id, currentYear) => {
    const [result] = await database.query('SELECT lt.type_name,lb.allocated_days,lb.used_days,lb.carry_forwarded,(lb.allocated_days-lb.used_days+lb.carry_forwarded) AS remaining_days FROM leavebalances as lb JOIN leavetypes as lt ON lb.leavetype_id=lt.leavetype_id WHERE lb.employee_id=? AND lb.year=?', [employee_id, currentYear]);
    return result;
}

