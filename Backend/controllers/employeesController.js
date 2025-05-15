const { request } = require('https');
const { error } = require('console');
const { console } = require('inspector');
const employeeModel = require('../models/employeesModel');
const { read } = require('fs');

exports.getAllEmployees = async (request, h) => {
   
    try {
        const data = await employeeModel.getAllEmployees();
        return h.response(data).code(200);

    } catch (error) {
        console.error('Error fetching employees:', error);
        return h.response({ error: 'Failed to fetch employees' }).code(500);
    }
};

exports.getEmployeesById = async (request, h) => {
    const { id } = request.params;
    try {
        const result = await employeeModel.getEmployeesById(id);
        if (result.length == 0) {
            return h.response({ error: "The employee ID is not found" }).code(404);
        }
        return h.response({ message: "Successfully get " }).code(200);
    } catch (error) {
        console.error("Failed to get employee by ID", error);
        return h.response({ error: "Failed to fetch the employee details" }).code(500);
    }
};


exports.addEmployee = async (request, h) => {

    const { name, email, password, role, manager_id, hr_id, director_id, join_date } = request.payload;

    try {
        const result = await employeeModel.addEmployee({ name, email, password, role, manager_id, hr_id, director_id, join_date });
        return h.response({ message: "Employee is added ", employee_id: result.insertId }).code(200);

    } catch (error) {
        if (error.message === 'Email already exists') {
            return h.response({ message: error.message }).code(400);
        }
        console.error('Internal server error in controller', error);
        return h.response({ message: 'Internal server error controller' }).code(500);
    }
};


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

// get the role for admin
exports.getUsersRoles = async (request, h) => {
    try {
        const users = await employeeModel.getUsersRoles();
        return h.response({ message: "Successfully get roles", users }).code(200);
    } catch (error) {
        console.error("Fail to get roles", error)
        return h.response({ message: "Internal server error" }).code(500)
    }
}



