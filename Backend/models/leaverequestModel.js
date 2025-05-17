const database = require('../config/db');

exports.addLeaverequest = async (employee_id, leavetype_id, start_date, end_date, reason, status, is_lop,days) => {
    const [result] = await database.query('INSERT INTO leaverequests (employee_id,leavetype_id,start_date,end_date,reason,status,is_lop,days) VALUES(?,?,?,?,?,?,?,?)', [employee_id, leavetype_id, start_date, end_date, reason, status, is_lop,days]);
    return result;
}

exports.getAllLeaverequest = async () => {
    const [result] = await database.query('SELECT * FROM leaverequests');
    return result;
}

exports.getLeaverequestById = async (req_id) => {
    const [result] = await database.query('SELECT * FROM leaverequests WHERE request_id=?', [req_id]);
    return result;
}


exports.getAllLeaverequestById = async (employee_id) => {
    const [result] = await database.query(`SELECT lr.*, lt.type_name 
FROM leaverequests AS lr
JOIN leavetypes AS lt ON lr.leavetype_id = lt.leavetype_id
WHERE lr.employee_id = ?`,[employee_id]);
    return result;
}

exports.cancelLeaverequest = async (req_id, emp_id) => {
    const [result] = await database.query(`UPDATE leaverequests SET status='cancelled' WHERE request_id=? AND employee_id=?`, [req_id, emp_id])
    return result;
}


exports.getLeaverequestIdDelete = async (req_id) => {
    const [result] = await database.query('DELETE FROM leaverequests WHERE request_id = ?',
        [req_id]
    );
    return result;
};

exports.autoApprove = async ({ request_id, role, status }) => {
    const [result] = await database.query(
        `INSERT INTO leaveapprovals (request_id, role, status)
         VALUES (?, ?, ?)`,
        [request_id, role, status]
    );
    return result;
};
