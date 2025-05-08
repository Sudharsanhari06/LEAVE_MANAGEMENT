const database = require('../config/db');
exports.updateLeaveapproval = async (req_id, approved_by, role, status) => {
    const [exist] = await database.query('SELECT * FROM leaveapprovals WHERE request_id=? AND role=?', [req_id, role]);
    if (exist.length > 0) {
        return await database.query(
            'UPDATE leaveapprovals SET status=?, approved_by=?, WHERE request_id=? AND role=?', [status, approved_by, request_id, role]
        )
    } else {
        return await database.query('INSERT INTO leaveapprovals (requset_id,approved_by,role,status) VALUES (?,?,?)', [request_id, approved_by, role, status]);
    }
}





