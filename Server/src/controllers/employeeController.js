import * as employeeService from '../services/employeeService.js';

export const getAllEmployees = async (request, h) => {
    try {
        const data = await employeeService.getAllEmployees();
        return h.response(data).code(200);
    } catch (error) {
        console.error('Error fetching employees:', error);
        return h.response({ error: 'Failed to fetch employees' }).code(500);
    }
};

export const getEmployeesById = async (request, h) => {
    const { id } = request.params;
    try {
        const result = await employeeService.getEmployeesById(id);
        if (!result) {
            return h.response({ error: 'The employee ID is not found' }).code(404);
        }
        return h.response(result).code(200);
    } catch (error) {
        console.error('Failed to get employee by ID:', error);
        return h.response({ error: 'Failed to fetch the employee details' }).code(500);
    }
};



export const addEmployee = async (request, h) => {
    const { name, email, password, role, manager_id, hr_id, director_id, join_date } = request.payload;
    try {
        const result = await employeeService.addEmployee({
            name,
            email,
            password,
            role,
            manager_id,
            hr_id,
            director_id,
            join_date
        });

        return h.response({
            message: 'Employee added successfully',
            employee_id: result.employee_id
        }).code(200);
    } catch (error) {
        if (error.message === 'Email already exists') {
            return h.response({ message: error.message }).code(400);
        }
        console.error('Error in controller addEmployee:', error);
        return h.response({ message: 'Internal server error' }).code(500);
    }
};



export const updateEmployee = async (request, h) => {
    const { id } = request.params;
    const { name, role, manager_id, hr_id, director_id, join_date, email, password } = request.payload;

    try {
        const result = await employeeService.updateEmployee({
            id,
            name,
            role,
            manager_id,
            hr_id,
            director_id,
            join_date,
            email,
            password
        });

        if (result.affectedRows === 0) {
            return h.response({ error: 'Employee not found' }).code(404);
        }

        return h.response({ message: 'Employee updated successfully' }).code(200);
    } catch (error) {
        console.error('Error in controller updateEmployee:', error);
        return h.response({ error: 'Internal server error' }).code(500);
    }
};


export const deleteEmployee = async (request, h) => {
    const { id } = request.params;

    try {
        await employeeService.deleteEmployee(id);
        return h.response({ message: 'Employee deleted successfully' }).code(200);
    } catch (error) {
        console.error('Error in controller deleteEmployee:', error);
        return h.response({ error: 'Failed to delete employee' }).code(500);
    }
};

export const getUsersRoles = async (request, h) => {
    try {
        const users = await employeeService.getUsersRoles();
        return h.response({ message: 'Successfully fetched roles', users }).code(200);
    } catch (error) {
        console.error('Error in controller getUsersRoles:', error);
        return h.response({ message: 'Internal server error' }).code(500);
    }
};


export const getMangerbyEmployee = async (request, h) => {

    const{managerId}=request.params;
    console.log("managerId",managerId)
    try {
        const result = await employeeService.getMangerbyEmployee(Number(managerId));
        return h.response({ message: 'Successfully  get Employees', result}).code(200);
    } catch (error) {
        console.error('Error in controller get all employees:', error);
        return h.response({ message: 'Internal server error' }).code(500);
    }
}

