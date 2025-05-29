const database = require('../config/db');
const bcrypt = require('bcrypt');

// wo
exports.getAllEmployees = async () => {
    const [rows] = await database.query('SELECT * FROM employees WHERE flag=true ORDER BY employee_id DESC');
    return rows;
}

// wo
exports.getEmployeesById = async (id) => {
    const [result] = await database.query('SELECT * FROM employees WHERE employee_id=?', [id]);
    return result;
}

// wo
exports.addEmployee = async ({ name, email, password, role, manager_id, hr_id, director_id, join_date }) => {

    const [exist] = await database.query('SELECT * FROM employees WHERE email=?', [email]);
    if (exist.length > 0) {
        throw new Error('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await database.query('INSERT INTO employees (name,email, password,role,manager_id,hr_id,director_id,join_date) VALUES (?,?,?,?,?,?,?,?)', [name, email, hashedPassword, role, manager_id, hr_id, director_id, join_date]);

    return result;
}

exports.updateEmployee = async (name, role, manager_id, hr_id, director_id, join_date, email,password, id) => {

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await database.query('UPDATE employees SET name=?, role = ?, manager_id = ?, hr_id = ?, director_id = ?, join_date = ?,email=?, password=? WHERE employee_id = ?', [name, role, manager_id, hr_id, director_id, join_date, email,hashedPassword, id])
    return result;
}

exports.deleteEmployee = async (id) => {
    const [result, fields] = await database.query('UPDATE employees SET flag=false WHERE employee_id=?', [id]);
    console.log("fields:", fields);
    return result;
}

// wo
exports.getUsersRoles=async()=>{
    const[result]=await database.query('SELECT employee_id,name,role FROM employees WHERE role IN (?,?,?)',['Hr', 'manager', 'Director']);
    return result;
}