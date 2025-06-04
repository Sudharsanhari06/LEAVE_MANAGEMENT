import { EntitySchema } from "typeorm";



export const LeaveBalance= new EntitySchema({
  name: "LeaveBalance",
  tableName: "leavebalances",
  columns: {
    balance_id: {
      primary: true,
      type: "int",
      generated: true,
    },
    employee_id: {
      type: "int",
    },
    leavetype_id: {
      type: "int",
    },
    year: {
      type: "int",
    },
    allocated_days: {
      type: "int",
      default: 20,
    },
    used_days: {
      type: "int",
      default: 0,
    },
    carry_forwarded: {
      type: "int",
      default: 0,
      nullable:true
    },
  },
  relations: {
    employee_id: {
      target: "Employee",
      type: "many-to-one",
      joinColumn: { name: "employee_id" },
      inverseSide: "leaveBalances",
      eager: true, 
    },
    leavetype_id: {
      target: "LeaveTypes",
      type: "many-to-one",
      joinColumn: { name: "leavetype_id" },
      inverseSide: "leaveBalance",
      eager: true,
    },
  },
});
