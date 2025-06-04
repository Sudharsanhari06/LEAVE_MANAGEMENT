import { AppDataSource } from '../data-source.js';  // your TypeORM DataSource setup
import { LeaveBalance } from '../entities/LeaveBalance.js';  // your LeaveBalance entity
const leaveBalanceRepository = AppDataSource.getRepository(LeaveBalance);

export const getAllLeavebalance = async () => {
    return await leaveBalanceRepository.find();
  };
  
  export const getByIdLeavebalance = async (id) => {
    return await leaveBalanceRepository.findOneBy({ balance_id: id });
  };
  
  export const addLeavebalance = async (employee_id, leavetype_id, year, allocated_days = 20, used_days = 0, carry_forwarded = 0) => {
    const leaveBalance = leaveBalanceRepository.create({
      employee_id,
      leavetype_id,
      year,
      allocated_days,
      used_days,
      carry_forwarded,
    });
    return await leaveBalanceRepository.save(leaveBalance);
  };
  
  export const updateByIdLeavebalance = async (employee_id, leavetype_id, year, allocated_days, used_days, carry_forwarded, id) => {
    const leaveBalance = await leaveBalanceRepository.findOneBy({ balance_id: id });
    if (!leaveBalance) return null;  // or throw error
  
    leaveBalance.employee_id = employee_id;
    leaveBalance.leavetype_id = leavetype_id;
    leaveBalance.year = year;
    leaveBalance.allocated_days = allocated_days;
    leaveBalance.used_days = used_days;
    leaveBalance.carry_forwarded = carry_forwarded;
  
    return await leaveBalanceRepository.save(leaveBalance);
  };
  
  export const deleteByIdLeavebalance = async (id) => {
    return await leaveBalanceRepository.delete({ balance_id: id });
  };
  