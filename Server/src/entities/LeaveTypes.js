import { EntitySchema } from "typeorm";

export const LeaveTypes = new EntitySchema({
    name: 'LeaveTypes',
    tableName: 'leavetypes',
    columns: {
        leavetype_id: {
            primary: true,
            type: "int",
            generated: true,
          },
          type_name: {
            type: "varchar",
            nullable: false,
          },
          auto_approve: {
            type: "boolean",
            default: false,
          },
          max_days: {
            type: "int",
            nullable: false,
          },
          isactive: {
            type: "boolean",
            default: true,
          }
    }
})