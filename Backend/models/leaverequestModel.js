const database = require('../config/db');

//wo
exports.addLeaverequest = async (employee_id, leavetype_id, start_date, end_date, reason, status, is_lop, days) => {
    const [result] = await database.query('INSERT INTO leaverequests (employee_id,leavetype_id,start_date,end_date,reason,status,is_lop,days) VALUES(?,?,?,?,?,?,?,?)', [employee_id, leavetype_id, start_date, end_date, reason, status, is_lop, days]);
    return result;
}

exports.getAllLeaverequest = async () => {
    const [result] = await database.query('SELECT * FROM leaverequests');
    return result;
}

// wo
exports.getLeaverequestById = async (req_id) => {
    const [result] = await database.query('SELECT * FROM leaverequests WHERE request_id=?', [req_id]);
    return result;
}

// wo
exports.getAllLeaverequestById = async (employee_id) => {
    const [result] = await database.query(`SELECT lr.*, lt.type_name 
FROM leaverequests AS lr
JOIN leavetypes AS lt ON lr.leavetype_id = lt.leavetype_id
WHERE lr.employee_id = ? AND lr.flag=true ORDER BY lr.request_id DESC`, [employee_id]);
    return result;
}


// wo
exports.cancelLeaverequest = async (req_id) => {
    const [result] = await database.query(`UPDATE leaverequests SET status = 'cancelled' WHERE request_id = ?`,
        [req_id]
    )
    return result
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

exports.backUsedLeaveDays = async (employee_id, leavetype_id, days) => {
    const currentYear = new Date().getFullYear();
    const [result] = await database.query(`UPDATE leavebalances SET used_days = used_days - ? 
     WHERE employee_id = ? 
       AND leavetype_id = ? 
       AND year = ?`, [days, employee_id, leavetype_id, currentYear]);
    return result;
}



//work
exports.usedLeavedaysEmployee = async (employee_id) => {
    const [used] = await database.query(
        `SELECT leavetype_id, SUM(days) as used_days 
            FROM leaverequests 
            WHERE employee_id = ? AND status NOT IN('cancelled','rejected')
            GROUP BY leavetype_id`,
        [employee_id]
    );
    return used;

}

exports.getApprovedLeavesByEmployee = async (employeeId, start, end) => {

    const [rows] = await database.query(
        `SELECT 
         lr.request_id, lr.start_date, lr.end_date, 
         lt.type_name
       FROM leaverequests AS lr
       JOIN leavetypes lt ON lr.leavetype_id = lt.leavetype_id
       WHERE lr.employee_id = ? 
         AND lr.status = 'approved'
         AND (
           lr.start_date BETWEEN ? AND ?
           OR lr.end_date BETWEEN ? AND ?
         )`,
        [employeeId, start, end, start, end]
    );
    return rows;
}


// update
// wo
exports.updateLeaveRequestStatus = async (request_id, status) => {
    return await database.query(
        `UPDATE leaverequests SET status = ? WHERE request_id = ?`,
        [status, request_id]
    );
};


exports.getApprovedStatus = async () => {
    const [rows] = await database.query(`
        SELECT 
          l.start_date, 
          l.end_date, 
          e.name AS title

        FROM 
          leaverequests AS l
        JOIN 
          employees AS e ON l.employee_id = e.employee_id
        WHERE 
          l.status = 'approved'
      `)
    return rows;
}


exports.dateOverlap = async (employeeId) => {

    const [rows] = await database.query
        (
            `SELECT start_date, end_date FROM leaverequests
         WHERE employee_id = ? AND status IN ('pending', 'approved')`,
            [employeeId]
        );
    return rows;
}



