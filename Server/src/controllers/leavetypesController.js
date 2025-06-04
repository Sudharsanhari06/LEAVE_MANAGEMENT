import * as leavetypesService from "../services/leavetypesService.js";

export const getAllLeaveTypes = async (request, h) => {
  try {
    const data = await leavetypesService.getAllLeaveTypes();
    return h.response(data);
  } catch (err) {
    console.error("Failed to get leave types:", err);
    return h.response({ error: "Failed to fetch leave types" }).code(500);
  }
};

export const getLeaveTypeById = async (request, h) => {
  const { id } = request.params;
  try {
    const data = await leavetypesService.getLeaveTypeById(id);
    if (!data) {
      return h.response({ error: "Leave type not found" }).code(404);
    }
    return h.response(data);
  } catch (err) {
    console.error("Failed to get leave type:", err);
    return h.response({ error: "Error fetching leave type" }).code(500);
  }
};

export const addLeaveType = async (request, h) => {
  const { type_name, auto_approve, max_days } = request.payload;
  try {
    await leavetypesService.addLeaveType(type_name, auto_approve, max_days);
    return h.response({ message: "Leave type added successfully" }).code(201);
  } catch (err) {
    console.error("Failed to add leave type:", err);
    return h.response({ error: "Error adding leave type" }).code(500);
  }
};

export const updateLeaveType = async (request, h) => {
  const { id } = request.params;
  const { type_name, auto_approve, max_days } = request.payload;
  try {
    const result = await leavetypesService.updateLeaveType(id, type_name, auto_approve, max_days);
    if (result.affected === 0) {
      return h.response({ error: "Leave type not found" }).code(404);
    }
    return h.response({ message: "Leave type updated successfully" }).code(200);
  } catch (err) {
    console.error("Failed to update leave type:", err);
    return h.response({ error: "Error updating leave type" }).code(500);
  }
};

export const deleteLeaveType = async (request, h) => {
  const { id } = request.params;
  try {
    const result = await leavetypesService.deleteLeaveType(id);
    if (result.affected === 0) {
      return h.response({ error: "Leave type not found" }).code(404);
    }
    return h.response({ message: "Leave type deleted successfully" }).code(200);
  } catch (err) {
    console.error("Failed to delete leave type:", err);
    return h.response({ error: "Error deleting leave type" }).code(500);
  }
};
