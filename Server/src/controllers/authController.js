import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/db.js';
import { Employee } from '../entities/Employee.js';
import dotenv from 'dotenv';
dotenv.config();


export const login = async (request, h) => {
    const { email, password } = request.payload;
    const employeeRepo = AppDataSource.getRepository(Employee);
    const user = await employeeRepo.findOneBy({ email });

    if (!user) {
        return h.response({ message: 'User not found' }).code(404);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return h.response({ message: 'Invalid credentials' }).code(401);
    }

    const payload = {
        employee_id: user.employee_id,
        name: user.name,
        role: user.role
    };

    const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1d' });

    return h.response({
        message: 'Login successful',
        token,
        is_first_login: user.is_first_login
    }).code(200);
};




export const changePassword = async (request, h) => {
    const { oldPassword, newPassword } = request.payload;
    const employeeId = request.auth.employee_id;

    try {
        const employeeRepo = AppDataSource.getRepository(Employee);
        
        const user = await employeeRepo.findOneBy({ employee_id: employeeId });

        if (!user) {
            return h.response({ message: 'User not found' }).code(404);
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return h.response({ message: 'Old password is incorrect' }).code(401);
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.is_first_login = false;

        await employeeRepo.save(user);

        return h.response({ message: 'Password updated successfully' }).code(200);
    } catch (error) {
        console.error('Change password error:', error);
        return h.response({ message: 'Server error' }).code(500);
    }
};