// src/service/leaveRequestService.js
import { AppDataSource } from '../config/db.js';
import { LeaveRequest } from '../entities/LeaveRequest.js';
import { LeaveApprovals } from '../entities/LeaveApprovals.js';

export const addLeaveRequest = async (data) => {
  const repo = AppDataSource.getRepository(LeaveRequest);
  const newRequest = repo.create(data);
  return await repo.save(newRequest);
};

export const getAllLeaveRequests = async () => {
  const repo = AppDataSource.getRepository(LeaveRequest);
  return await repo.find({
    relations:['approvals', 'employee_id', 'leavetype_id'],
    order: { request_id: 'DESC' }
  });
};

export const getLeaveRequestById = async (request_id) => {
  const repo = AppDataSource.getRepository(LeaveRequest);
  return await repo.findOneBy({ request_id });
};

// wo
export const getAllLeaveRequestByEmployeeId = async (employeeId) => {
  const repo = AppDataSource.getRepository(LeaveRequest);
  return await repo.find({
    where: { employee_id: Number(employeeId) },
    relations:['approvals', 'employee_id', 'leavetype_id'],
    order: { request_id: 'DESC' },
    // relations: ['leavetype_id'], // assuming proper relation is defined
  });
};

export const cancelLeaveRequest = async (request_id) => {
  const repo = AppDataSource.getRepository(LeaveRequest);
  return await repo.update({ request_id }, { status: 'cancelled' });
};

export const autoApprove = async ({ request_id, role, status }) => {
  const repo = AppDataSource.getRepository(LeaveApprovals);
  const approval = repo.create({ request_id, role, status });
  return await repo.save(approval);

};

export const backUsedLeaveDays = async (employee_id, leavetype_id, days) => {
  const year = new Date().getFullYear();
  return await AppDataSource.query(`
    UPDATE leavebalances
    SET used_days = used_days - ?
    WHERE employee_id = ? AND leavetype_id = ? AND year = ?`,
    [days, employee_id, leavetype_id, year]
  );
};


export const usedLeaveDaysEmployee = async (employee_id) => {
  return await AppDataSource.query(`
    SELECT leavetype_id, SUM(days) as used_days 
    FROM leaverequests 
    WHERE employee_id = ? AND status NOT IN ('cancelled','rejected')
    GROUP BY leavetype_id`,
    [employee_id]
  );
};

export const getApprovedLeavesByEmployee = async (employeeId, start, end) => {

  return await AppDataSource.query(`
    SELECT lr.request_id, lr.start_date, lr.end_date, lt.type_name
    FROM leaverequests AS lr
    JOIN leavetypes lt ON lr.leavetype_id = lt.leavetype_id
    WHERE lr.employee_id = ? AND lr.status = 'approved'
    AND (
      lr.start_date BETWEEN ? AND ?
      OR lr.end_date BETWEEN ? AND ?
    )`,
    [employeeId, start, end, start, end]
  );
};

export const updateLeaveRequestStatus = async (request_id, status) => {
  const repo = AppDataSource.getRepository(LeaveRequest);
  return await repo.update({ request_id }, { status });
};

export const getApprovedStatus = async () => {
  return await AppDataSource.query(`
    SELECT l.start_date, l.end_date, e.name AS title
    FROM leaverequests AS l
    JOIN employees AS e ON l.employee_id = e.employee_id
    WHERE l.status = 'approved'`
  );
};

export const dateOverlap = async (employeeId) => {
  return await AppDataSource.query(`
    SELECT start_date, end_date FROM leaverequests
    WHERE employee_id = ? AND status IN ('pending', 'approved')`,
    [Number(employeeId)]
  );
};
