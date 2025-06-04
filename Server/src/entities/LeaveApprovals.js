import { EntitySchema } from "typeorm";
export const LeaveApprovals= new EntitySchema({
    name: "LeaveApprovals",
    tableName: "leaveapprovals",
    columns: {
        approval_id: {
            primary: true,
            type: "int",
            generated:true
        },
        role: {
            type: "enum",
            enum: ['manager','hr','director','system'],
            nullable:true
        },
        reason: {
            type: "varchar",
            length: 70,
            nullable: true,
        },
        status: {
            type: "enum",
            enum: ['approved','rejected','pending','inactive'],
            default: "pending",
        },
    },
    relations: {
        request_id: {
            type: "many-to-one",
            target: "LeaveRequest",
            joinColumn: {
                name: "request_id",
            },
            nullable: true 
        },
        approved_by: {
            type: "many-to-one",
            target: "Employee",
            joinColumn: {
                name: "approved_by",
            },
            nullable: true 
        }
    },
});
