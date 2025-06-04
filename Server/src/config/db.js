import dotenv from 'dotenv';
dotenv.config();

import { DataSource } from 'typeorm';
import { Employee } from '../entities/Employee.js';
import { LeaveTypes } from '../entities/LeaveTypes.js';
import {LeaveRequest} from '../entities/LeaveRequest.js';
import { LeaveApprovals } from '../entities/LeaveApprovals.js';
import { LeaveBalance } from '../entities/LeaveBalance.js';
import { Holiday } from '../entities/Holiday.js';


export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,              
  port: parseInt(process.env.DB_PORT),     
  username: process.env.DB_USER,           
  password: process.env.DB_PASSWORD,       
  database: process.env.DB_NAME,          
  synchronize: true,
  logging: true,
  entities: [Employee,LeaveTypes,LeaveRequest,LeaveApprovals,LeaveBalance,Holiday]
});
