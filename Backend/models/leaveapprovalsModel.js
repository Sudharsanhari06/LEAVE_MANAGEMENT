const database = require('../config/db');

exports.updateLeaveapproval = async (req_id, approved_by, role, status) => {
    const [exist] = await database.query('SELECT * FROM leaveapprovals WHERE request_id=? AND role=?', [req_id, role]);
    if (exist.length > 0) {
        return await database.query(
            'UPDATE leaveapprovals SET status=?, approved_by=? WHERE request_id=? AND role=?', [status, approved_by, req_id, role]
        )
    } else {
        return await database.query('INSERT INTO leaveapprovals (requset_id,approved_by,role,status) VALUES (?,?,?,?)', [req_id, approved_by, role, status]);
    }
}

exports.getAllapprovalById = async (req_id) => {
    const [rows] = await database.query(
        'SELECT * FROM leaveapprovals WHERE req_id = ?', [req_id]
    );
    return rows;
};


exports.getAllapprovalByEmployeeId = async (emp_id) => {
    const [rows] = await database.query(
        `SELECT la.*, lr.reason, lr.start_date, lr.end_date, e.name AS approver_name
         FROM leave_approval la
         JOIN leave_request lr ON la.req_id = lr.req_id
         JOIN employees e ON la.approver_id = e.employee_id
         WHERE la.approver_id = ?`,
        [emp_id]
    );
    return rows;
};
