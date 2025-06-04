import { AppDataSource } from "../config/db.js";
// import { LeaveTypes } from "../entities/LeaveTypes.js";

const leaveTypeRepo = AppDataSource.getRepository('LeaveTypes');
export const getAllLeaveTypes = async () => {

  return await leaveTypeRepo.find({
    select: ["leavetype_id", "type_name", "max_days"],
    where: { isactive: true },
  });
};

export const getLeaveTypeById = async (id) => {
 
  return await leaveTypeRepo.findOne({
    where: { leavetype_id: id, isactive: true },
  });
};

export const addLeaveType = async (type_name, auto_approve, max_days) => {

  const leaveType = leaveTypeRepo.create({ type_name, auto_approve, max_days });
  return await repo.save(leaveType);
};

export const updateLeaveType = async (id, type_name, auto_approve, max_days) => {

  const result = await leaveTypeRepo.update({ leavetype_id: id }, {type_name,auto_approve,max_days});
  return result;
};

export const deleteLeaveType = async (id) => {

  const result = await leaveTypeRepo.update({ leavetype_id: id }, { isactive: false });
  return result;

};