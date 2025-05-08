const { request } = require('https');
const { error } = require('console');
const { console } = require('inspector');
const employeeModel = require('../models/employeesModel');

exports.getAllEmployees = async (request, h) => {
    try {
        const data = await employeeModel.getAllEmployees();
        return h.response(data).code(200);
        
    } catch (error) {
        console.error('Error fetching employees:', error);
        return h.response({ error: 'Failed to fetch employees' }).code(500);
    }
};

exports.addEmployee = async (request, h) => {
    const { name, role, manager_id, hr_id, director_id, join_date } = request.payload;
    const result = await employeeModel.addEmployee(name, role, manager_id, hr_id, director_id, join_date);
    return h.response({ message: "employee is added", employee_id: result.insertId }).code(201);
}

exports.updateEmployee = async (request, h) => {
    const { id } = request.params;
    const { name, role, manager_id, hr_id, director_id, join_date } = request.payload;
    try {
        const result = await employeeModel.updateEmployee(name, role, manager_id, hr_id, director_id, join_date, id);
        if (result.affectedRows == 0) {
            return h.response({
                error: 'Employee is Not Found'
            }).code(404);
        }
        return h.response({ message: 'employee update successfully' }).code(200);
    } catch (error) {
        console.error('Error to update employee', error);
        return h.response({ error: 'Error to update employee' }).code(500);
    }
}

exports.deleteEmployee = async (request, h) => {
    const { id } = request.params;
    try {
        const result = await employeeModel.deleteEmployee(id);
        return h.response({ message: 'employee successfully deleted' }).code(200);
    } catch (error) {
        console.error();
        return h.response({ error: 'failed to delete employee' }).code(500);
    }
}

