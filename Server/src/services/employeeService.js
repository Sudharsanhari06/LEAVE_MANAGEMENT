import { AppDataSource } from '../config/db.js';
import bcrypt from 'bcrypt';

const employeeRepo = AppDataSource.getRepository('Employee');

export const getAllEmployees = async () => {
    return await employeeRepo.find({
        relations: ['manager_id', 'hr_id', 'director_id'],
        where: { flag: true },
        order: { employee_id: 'DESC' },
    });
};

export const getEmployeesById = async (id) => {
    return await employeeRepo.findOne({
        where: { employee_id: parseInt(id) },
        relations: ['manager_id', 'hr_id', 'director_id'],
      });
};

export const addEmployee = async ({ name, email, password, role, manager_id, hr_id, director_id, join_date }) => {
    const existingEmployee = await employeeRepo.findOneBy({ email });

    if (existingEmployee) {
        throw new Error('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const employee = employeeRepo.create({
        name,
        email,
        password: hashedPassword,
        role,
        manager_id,
        hr_id,
        director_id,
        join_date,
        flag: true, 
    });

    const result = await employeeRepo.save(employee);
    return result;
};

export const updateEmployee = async ({ id, name, role, manager_id, hr_id, director_id, join_date, email, password }) => {
    const employee = await employeeRepo.findOneBy({ employee_id: parseInt(id) });
    if (!employee) {
        return { affectedRows: 0 };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    employee.name = name;
    employee.role = role;
    employee.manager_id = manager_id;
    employee.hr_id = hr_id;
    employee.director_id = director_id;
    employee.join_date = join_date;
    employee.email = email;
    employee.password = hashedPassword;
    
    await employeeRepo.save(employee);
    return { affectedRows: 1 };
};

export const deleteEmployee = async (id) => {
    const employee = await employeeRepo.findOneBy({ employee_id: parseInt(id) });
    if (!employee) {
        throw new Error('Employee not found');
    }

    employee.flag = false;
    await employeeRepo.save(employee);
    return { message: 'Employee deleted (flag set to false)' };
};

export const getUsersRoles = async () => {
    return await employeeRepo
        .createQueryBuilder('employee')
        .select(['employee.employee_id', 'employee.name', 'employee.role'])
        .where('employee.role IN (:...roles)', { roles: ['Hr', 'manager', 'Director'] })
        .getMany();
};


export const getMangerbyEmployee=async(managerId)=>{
    return await employeeRepo.find({
        where:{
            manager_id:{employee_id:managerId}
        },
        relations:['manager_id']
    });
}