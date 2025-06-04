import { EntitySchema } from "typeorm";

export const Employee = new EntitySchema({
  name: 'Employee',
  tableName: 'employees',
  columns: {
    employee_id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    name: {
      type: 'varchar',
      nullable: false, // NOT NULL
    },
    email: {
      type: 'varchar',
      nullable: true
    },
    password: {
      type: 'varchar',
      nullable: true, // IS NULL
    },
    role: {
      type: 'enum',
      enum: ['manager', 'intern', 'hr', 'director', 'developer', 'trainee'],
      nullable: true
    },
    join_date: {
      type: 'date',
      nullable: true
    },
    flag: {
      type: 'boolean',
      default: true,
    },
    is_first_login: {
      type: 'boolean',
      default: true,
    },
  },
  relations: {
    manager_id: {
      type: 'many-to-one',
      target: 'Employee',
      joinColumn: { name: 'manager_id' },
      nullable: true,
    },
    hr_id: {
      type: 'many-to-one',
      target: 'Employee',
      joinColumn: { name: 'hr_id' },
      nullable: true,
    },
    director_id: {
      type: 'many-to-one',
      target: 'Employee',
      joinColumn: { name: 'director_id' },
      nullable: true,
    },
  },
});
