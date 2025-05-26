const database = require('../config/db');

// exports.updateLeaveapproval = async (req_id, approved_by, role, status) => {
//     const [exist] = await database.query('SELECT * FROM leaveapprovals WHERE request_id=? AND role=?', [req_id, role]);
//     if (exist.length > 0) {
//         return await database.query(
//             'UPDATE leaveapprovals SET status=?, approved_by=? WHERE request_id=? AND role=?', [status, approved_by, req_id, role]
//         )
//     } else {
//         return await database.query('INSERT INTO leaveapprovals (requset_id,approved_by,role,status) VALUES (?,?,?,?)', [req_id, approved_by, role, status]);
//     }
// }

exports.getAllapprovalById = async (req_id) => {
    const [rows] = await database.query(
        'SELECT * FROM leaveapprovals WHERE request_id = ?', [req_id]
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




// 
exports.addApprovalStep = async (request_id, role, status = 'pending') => {
    return await database.query(
        `INSERT INTO leaveapprovals (request_id, approved_by, status, role)
       VALUES (?, NULL, ?, ?)`,
        [request_id, status, role]
    );
};

exports.updateApprovalStatus = async ({ request_id, role, decision, approved_by }) => {
    return await database.query(
        `UPDATE leaveapprovals SET status = ?, approved_by = ?
       WHERE request_id = ? AND role = ? AND status = 'pending'`,
        [decision, approved_by, request_id, role]
    );
};


exports.activateNextRole = async (request_id, role) => {
    return await database.query(
        `UPDATE leaveapprovals SET status = 'pending'
       WHERE request_id = ? AND role = ?`,
        [request_id, role]
    );
};




// leaveapprovalModel.getRequestsForRoleMapped
exports.getRequestsForRoleMapped = async (role, approver_id) => {
    let column = '';
    if (role === 'manager') column = 'e.manager_id';
    if (role === 'Hr') column = 'e.hr_id';
    if (role === 'director') column = 'e.director_id';


    const query = `
      SELECT 
        lr.request_id AS request_id,
        e.name AS employee_name,
        lt.type_name AS leave_type,
        lr.start_date, lr.end_date, lr.days, lr.reason,
        la.status AS approval_status
      FROM leaverequests AS lr
      JOIN employees AS e ON lr.employee_id = e.employee_id
      JOIN leavetypes AS lt ON lr.leavetype_id = lt.leavetype_id
      JOIN leaveapprovals AS la ON la.request_id = lr.request_id
      WHERE ${column} = ? AND la.role = ? AND la.status = 'Pending'
    `;

    const [rows] = await database.query(query, [approver_id, role]);
    return rows;
};


exports.getMappedRequests = async ({ role, approved_by }) => {
  console.log("role",role,"approved_by",approved_by);
    const [rows] = await database.query(`
      SELECT
        lr.request_id AS request_id,
        e.name AS employee_name,
        lt.type_name AS leave_type,
        lr.start_date,
        lr.end_date,
        lr.days,
        lr.reason,
        la.status
      FROM leaveapprovals AS la
      JOIN leaverequests AS lr ON la.request_id = lr.request_id
      JOIN employees AS e ON lr.employee_id = e.employee_id
      JOIN leavetypes AS lt ON lr.leavetype_id = lt.leavetype_id
      WHERE la.role = ? AND la.approved_by = ? AND la.status = 'pending'
      ORDER BY lr.start_date DESC
      `, [role, approved_by]);
    return rows;
};



exports.autoApprove = async ({ request_id, role, status }) => {
    const [result] = await database.query(
        `INSERT INTO leaveapprovals (request_id, role, status) VALUES (?, ?, ?)`,
        [request_id, role, status]
    );
    return result;
};



exports.insertApproval = async ({ request_id, role, approved_by, status }) => {
    const [result] = await database.query(
      `INSERT INTO leaveapprovals (request_id,role,approved_by,status) VALUES (?, ?, ?, ?)`,
      [request_id, role, approved_by, status]
    );
    return result;
};



exports.getLeaveApprovalStatusByRequestId=async(requestId)=>{
    const[rows]=await database.query(`SELECT 
    la.role, 
    la.status, 
    emp.name AS approver_name
FROM 
    leaveapprovals AS la
JOIN 
    employees AS emp ON la.approved_by = emp.employee_id
WHERE 
    la.request_id = ?
ORDER BY 
    FIELD(la.role, 'manager', 'hr', 'director');
`,[requestId]);
        return rows;
}