import { EntitySchema } from 'typeorm';

export const Holiday = new EntitySchema({
  name: 'Holiday',
  tableName: 'holidays',
  columns: {
    holiday_id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    holiday_name: {
      type: 'varchar',
      nullable: false,
    },
    holiday_date: {
      type: 'date',
      nullable: false,
    },
  },
});