// src/models/leaveApprovalModel.js (TypeORM based)
import { AppDataSource } from '../config/db.js';
import { LeaveApprovals } from '../entities/LeaveApprovals.js';
import { LeaveRequest } from '../entities/LeaveRequest.js';
import { Employee } from '../entities/Employee.js';
import { LeaveTypes } from '../entities/LeaveTypes.js';

const leaveApprovalRepo = AppDataSource.getRepository(LeaveApprovals);
const leaveRequestRepo = AppDataSource.getRepository(LeaveRequest);

export const getAllapprovalById = async (request_id) => {
  return await leaveApprovalRepo.find({ where: { request: { request_id } } });
};

export const getAllapprovalByEmployeeId = async (emp_id) => {
  return await leaveApprovalRepo
    .createQueryBuilder('la')
    .leftJoinAndSelect('la.request', 'lr')
    .leftJoinAndSelect('la.approver', 'e')
    .where('la.approver = :emp_id', { emp_id })
    .select([
      'la',
      'lr.reason',
      'lr.start_date',
      'lr.end_date',
      'e.name',
    ])
    .getMany();
};

export const addApprovalStep = async (request_id, role, status = 'pending') => {
  const approval = leaveApprovalRepo.create({
    request: { request_id },
    role,
    status,
  });
  return await leaveApprovalRepo.save(approval);
};

// export const updateApprovalStatus = async ({ request_id, role, decision, approved_by, reason }) => {
//     const leaveApprovalRepo = AppDataSource.getRepository(LeaveApprovals);
//     const leaveRequestRepo = AppDataSource.getRepository(LeaveRequest);

//     const approval = await leaveApprovalRepo.findOne({
//         where: {
//           request_id: request_id,
//             role,
//             status: 'pending'
//         },
//         relations: ['request_id'],
//     });

//     if (!approval) {
//         return { error: 'Approval not found' };
//     }

//     approval.status = decision;
//     approval.reason = reason || null;
//     approval.approved_by = approved_by;
//     approval.is_active = false;
//     await leaveApprovalRepo.save(approval);

//     if (decision === 'approved') {
//         const allApprovals = await leaveApprovalRepo.find({
//             where: {request_id:request_id},
//         });

//         const hrApproval = allApprovals.find(a => a.role === 'hr');
//         const directorApproval = allApprovals.find(a => a.role === 'director');

//         if (role === 'manager') {
//             if (!hrApproval && !directorApproval) {
//                 await leaveRequestRepo.update(request_id, { status: 'approved' });
//             } else if (hrApproval) {
//                 hrApproval.is_active = true;
//                 await leaveApprovalRepo.save(hrApproval);
//             }
//         } else if (role === 'hr') {
//             if (!directorApproval) {
//                 await leaveRequestRepo.update(request_id, { status: 'approved' });
//             } else {
//                 directorApproval.is_active = true;
//                 await leaveApprovalRepo.save(directorApproval);
//             }
//         } else if (role === 'director') {
//             await leaveRequestRepo.update(request_id, { status: 'approved' });
//         }
//     } else if (decision === 'rejected') {
//         await leaveRequestRepo.update(request_id, { status: 'rejected' });
//     }

//     return { message: 'Status updated' };
// };

export const updateApprovalStatus = async ({ request_id, role, decision, approved_by, reason }) => {

  const approval = await leaveApprovalRepo.findOne({
    where: {
      request_id: request_id,
      role,
      status: 'pending'
    },
    relations: ['request_id'],
  });
  console.log("approval: ", approval);

  if (!approval) {
    return { error: 'Approval not found' };
  }

  approval.status = decision;
  approval.reason = reason || null;
  approval.approved_by = approved_by;
  await leaveApprovalRepo.save(approval);

  if (decision === 'approved') {
    const allApprovals = await leaveApprovalRepo.find({
      where: { request_id }
    });

    console.log("allApprovals: ", allApprovals);

    const hrApproval = allApprovals.find(a => a.role === 'hr');
    console.log("hrApproval :", hrApproval);
    const directorApproval = allApprovals.find(a => a.role === 'director');
    console.log("directorApproval", directorApproval);

    if (role === 'manager') {
      if (!hrApproval && !directorApproval) {
        await leaveRequestRepo.update(request_id, { status: 'approved' });
      } else if (hrApproval && hrApproval.status == 'inactive') {
        console.log("Active next role.....");
        await activateNextRole(request_id, 'hr');
      }

    } else if (role === 'hr') {
      if (!directorApproval) {
        await leaveRequestRepo.update(request_id, { status: 'approved' });
      } else {
        await activateNextRole(request_id, 'director');
      }
    } else if (role === 'director') {
      await leaveRequestRepo.update(request_id, { status: 'approved' });
    }
  } else if (decision === 'rejected') {
    await leaveRequestRepo.update(request_id, { status: 'rejected' });
  }

  return { message: 'Status updated' };
};




export const activateNextRole = async (request_id, role) => {
  console.log("request_id,role: ", request_id, role);

  const approval = await leaveApprovalRepo.findOne({
    where: { request_id, role },
  });
  if (approval) {
    approval.status = 'pending';
    return await leaveApprovalRepo.save(approval);
  }
};



// map
export const getMappedRequests = async ({ role, approved_by }) => {
  return await leaveApprovalRepo
    .createQueryBuilder('la')
    .leftJoinAndSelect('la.request', 'lr')
    .leftJoinAndSelect('lr.employee', 'e')
    .leftJoinAndSelect('lr.leave_type', 'lt')
    .where('la.role = :role AND la.approved_by = :approved_by AND la.status = :status', {
      role,
      approved_by,
      status: 'pending',
    })
    .orderBy('lr.start_date', 'DESC')
    .getMany();
};

export const autoApprove = async ({ request_id, role, status }) => {
  const approval = leaveApprovalRepo.create({
    request: { request_id },
    role,
    status,
  });
  return await leaveApprovalRepo.save(approval);
};

export const insertApproval = async ({ request_id, role, approved_by, status }) => {

  const approval = leaveApprovalRepo.create({
    request_id,
    role,
    approved_by: approved_by,
    status,
  });
  return await leaveApprovalRepo.save(approval);
};

export const getLeaveApprovalStatusByRequestId = async (request_id) => {
  return await leaveApprovalRepo
    .createQueryBuilder('la')
    .leftJoin('la.approved_by', 'emp')
    .where('la.request_id = :request_id', { request_id })
    .orderBy(`FIELD(la.role, 'manager', 'hr', 'director')`)
    .select([
      'la.role AS role',
      'la.status AS status',
      'la.reason AS reason',
      'emp.name AS approved_by_name'
    ])
    .getRawMany();
};






// -----------------------------
export const getMappedRequestsService = async ({ role, approved_by }) => {

  const repository = AppDataSource.getRepository(LeaveApprovals);
  console.log("role approved_by", role, approved_by);

  const result = await AppDataSource.getRepository(LeaveApprovals)
    .createQueryBuilder('la')
    .leftJoinAndSelect('la.request_id', 'lr')
    .leftJoinAndSelect('lr.employee_id', 'e')
    .leftJoinAndSelect('lr.leavetype_id', 'lt')
    .leftJoinAndSelect('la.approved_by', 'approver')
    .where('la.role = :role', { role })
    .andWhere('la.approved_by = :approved_by', { approved_by: Number(approved_by) })
    .andWhere('la.status = :status', { status: 'pending' })
    .andWhere('lr.status != :cancelled', { cancelled: 'cancelled' }) 
    .orderBy('lr.start_date', 'DESC')
    .getMany();

  console.log("results", result);

  return result.map(approval => ({
    request_id: approval.request_id.request_id,
    employee_name: approval.request_id.employee_id.name,
    leave_type: approval.request_id.leavetype_id.type_name,
    start_date: approval.request_id.start_date,
    end_date: approval.request_id.end_date,
    days: approval.request_id.days,
    reason: approval.request_id.reason,
    status: approval.status
  }));
};
