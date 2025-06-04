import bcrypt from 'bcrypt';
import { AppDataSource } from '../config/db.js';
import { Employee } from '../entities/Employee.js';

export const changePassword = async (request, h) => {
    const { oldPassword, newPassword } = request.payload;
    const employeeId = request.auth.employee_id;

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
};
