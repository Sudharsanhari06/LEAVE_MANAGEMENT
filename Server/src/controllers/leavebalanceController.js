import { AppDataSource } from '../config/db.js';  // your TypeORM DataSource instance
import { LeaveBalance } from '../entities/LeaveBalance.js';
import { LeaveTypes } from '../entities/LeaveTypes.js';
import { LeaveRequest } from '../entities/LeaveRequest.js';

const leaveBalanceRepository = AppDataSource.getRepository(LeaveBalance);
const leaveTypeRepository = AppDataSource.getRepository(LeaveTypes);
const leaveRequestRepository = AppDataSource.getRepository(LeaveRequest);

export const getAllLeavebalance = async (request, h) => {
  try {
    const leaveBalances = await leaveBalanceRepository.find();
    return h.response(leaveBalances).code(200);
  } catch (error) {
    console.error("Fail to get all leavebalance", error);
    return h.response({ error: 'Fail to get all leavebalance' }).code(500);
  }
};

export const getByIdLeavebalance = async (request, h) => {
  const { id } = request.params;
  try {
    const leaveBalance = await leaveBalanceRepository.findOneBy({ balance_id: parseInt(id) });
    if (!leaveBalance) {
      return h.response({ error: "leavebalance is Not Found" }).code(404);
    }
    return h.response(leaveBalance).code(200);
  } catch (error) {
    console.error("Fail to get leavebalance", error);
    return h.response({ error: "Fail to get leavebalance" }).code(500);
  }
};

export const addLeavebalance = async (request, h) => {
  try {
    const leaveBalanceData = request.payload;
    const leaveBalance = leaveBalanceRepository.create(leaveBalanceData);
    await leaveBalanceRepository.save(leaveBalance);
    return h.response({ message: "leavebalance successfully added" }).code(200);
  } catch (error) {
    console.error('Fail to add leavebalance', error);
    return h.response({ error: "Fail to add leavebalance" }).code(500);
  }
};

export const updateByIdLeavebalance = async (request, h) => {
  const { id } = request.params;
  try {
    const leaveBalanceData = request.payload;
    const leaveBalance = await leaveBalanceRepository.findOneBy({ balance_id: parseInt(id) });
    if (!leaveBalance) {
      return h.response({ error: "leavebalance is Not Found" }).code(404);
    }
    leaveBalanceRepository.merge(leaveBalance, leaveBalanceData);
    await leaveBalanceRepository.save(leaveBalance);
    return h.response({ message: 'the leave balance updated successfully' }).code(200);
  } catch (error) {
    console.error("Fail to update leave balance", error);
    return h.response({ error: 'Fail to update leave balance' }).code(500);
  }
};

export const deleteByIdLeavebalance = async (request, h) => {
  const { id } = request.params;
  try {
    const result = await leaveBalanceRepository.delete({ balance_id: parseInt(id) });
    if (result.affected === 0) {
      return h.response({ error: "leavebalance id Not found" }).code(404);
    }
    return h.response({ message: "leavebalance deleted successfully" }).code(200);
  } catch (error) {
    console.error("Fail to delete the leavebalance", error);
    return h.response({ error: "Fail to delete leavebalance" }).code(500);
  }
};

export const getLeavebalanceByEmployee = async (request, h) => {
  const { employee_id } = request.params;
  try {
    // Get all leave types
    const types = await leaveTypeRepository.find({
      where: { isactive: true }
    });

    // Get used leave days grouped by leave type for the employee
    const usedRaw = await leaveRequestRepository
      .createQueryBuilder("lr")
      .select("lr.leavetype_id", "leavetype_id")
      .addSelect("SUM(lr.days)", "used_days")
      .where("lr.employee_id = :employee_id", { employee_id })
      .andWhere("lr.status NOT IN ('cancelled', 'rejected')")
      .groupBy("lr.leavetype_id")
      .getRawMany();

    const usedMap = {};
    usedRaw.forEach(entry => {
      usedMap[entry.leavetype_id] = parseInt(entry.used_days);
    });

    let total_available_days = 0;
    const leave_types = types.map(type => {
      const used_days = usedMap[type.leavetype_id] || 0;
      const remaining_days = type.max_days - used_days;
      total_available_days += remaining_days;

      return {
        type_name: type.type_name,
        max_days: type.max_days,
        used_days,
        remaining_days
      };
    });

    return h.response({
      employee_id,
      total_available_days,
      leave_types,
    });
  } catch (error) {
    console.error('Error fetching leave balance:', error);
    return h.response({ error: 'Server error' }).code(500);
  }
};

export const getLeaveBalanceByEmployee = async (request, h) => {
  const { employee_id } = request.params;
  try {
    const balances = await leaveBalanceRepository.find({
      where: { employee_id: parseInt(employee_id) }
    });
    return h.response(balances).code(200);
  } catch (error) {
    console.error('Failed to fetch leave balance', error);
    return h.response({ error: "Failed to fetch leave balance" }).code(500);
  }
};
