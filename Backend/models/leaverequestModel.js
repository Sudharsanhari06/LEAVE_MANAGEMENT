const database = require('../config/db');

exports.addLeaverequest = async (employee_id, leavetype_id, start_date, end_date, reason, status, is_lop) => {
    const [result] = await database.query('INSERT INTO leaverequests (employee_id,leavetype_id,start_date,end_date,reason,status,is_lop) VALUES(?,?,?,?,?,?,?)', [employee_id, leavetype_id, start_date, end_date, reason, status, is_lop]);
    return result;
}

exports.getAllLeaverequest = async () => {
    const [result] = await database.query('SELECT * FROM leaverequests');
    return result;
}

// exports.getLeaverequestIdDelete=async(req_id)=>{

// }


exports.getLeaverequestById=async(req_id)=>{
    const[result]= await database.query('SELECT * FROM leaverequests WHERE request_id=?',[req_id]);
    return result;
}


exports.getAllLeaverequestById = async (id) => {
    const [result] = await database.query('SELECT * FROM leaverequests WHERE employee_id=?', [id]);
    return result;
}

exports.cancelLeaverequest = async (req_id, emp_id) => {
    const [result] = await database.query(`UPDATE leaverequests SET status='cancelled' WHERE request_id=? AND employee_id=?`, [req_id, emp_id])
    return result;
}