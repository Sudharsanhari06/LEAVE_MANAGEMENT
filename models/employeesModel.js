const database = require('../config/db');

exports.getAllEmployees = async () => {
    const [rows] = await database.query('SELECT * FROM employees');
    return rows;
}

exports.addEmployee = async (name, role, manager_id, hr_id, director_id, join_date) => {
    const [result] = await database.query('INSERT INTO employees (name,role,manager_id,hr_id,director_id,join_date) VALUES (?,?,?,?,?,?)', [name, role, manager_id, hr_id, director_id, join_date]);
    return result;
}

exports.updateEmployee = async (name, role, manager_id, hr_id, director_id, join_date, id) => {
    const [result] = await database.query('UPDATE employees SET name=?, role = ?, manager_id = ?, hr_id = ?, director_id = ?, join_date = ? WHERE employee_id = ?', [name, role, manager_id, hr_id, director_id, join_date, id])
    return result;
}

exports.deleteEmployee=async(id)=>{
    const[result,fields]=await database.query('DELETE FROM employees WHERE employee_id=?', [id]);
    console.log("fields:",fields);
    return result;
}


