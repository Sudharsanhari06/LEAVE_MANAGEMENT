import { EntitySchema } from 'typeorm';

export const LeaveRequest = new EntitySchema({
  name: 'LeaveRequest',
  tableName: 'leaverequests',
  columns: {
    request_id: {
      primary: true,
      type: 'int',
      name: 'request_id',
      generated: true,
    },
    start_date: {
      type: 'date',
      name: 'start_date',
      nullable:true
    },
    end_date: {
      type: 'date',
      name: 'end_date',
      nullable:true

    },
    reason: {
      type: 'text',
      nullable:true
    },
    status: {
      type: 'enum',
      enum: ['pending', 'approved', 'rejected', 'cancelled'],
      default: 'pending',
      nullable:true
    },
    days: {
      type: 'int',
    },
    flag: {
      type: 'tinyint',
      width: 1,
    },
    is_lop: {
      type: 'boolean',
      name: 'is_lop',
      default: false,
      nullable:true
    },
  },
  relations: {
    employee_id: {
      type: 'many-to-one',
      target: 'Employee', // assumes Employee entity is registered
      joinColumn: { name: 'employee_id' },
      onDelete: 'CASCADE',
    },
    leavetype_id: {
      type: 'many-to-one',
      target: 'LeaveTypes', // assumes LeaveType entity is registered
      joinColumn: { name: 'leavetype_id' },
      eager: false,
      onDelete: 'CASCADE',
    },
    approvals: {
      type: 'one-to-many',
      target: 'LeaveApprovals',
      inverseSide: 'request_id',
      cascade: true,
    },

  },
});
