import Joi from "joi";

import { getAllHolidays } from '../services/holidayService.js';
import { getAllLeaveRequests } from '../services/leaverequestService.js';


export const loginSchema = Joi.object({

    email: Joi.string().email().required().custom((value, helpers) => {
        if (!value.endsWith('@lumel.com')) {
            return helpers.error('email.domain');
        }
        return value;
    }).messages({
        'string.email': 'Email must be valid format',
        'email.domain': '@lumel.com emails are allowed',
        'any.required': 'Email is requird'
    }),
    password: Joi.string().required().messages({
        'string.empty': 'password is requird',
        'any.required': 'Email is requird'
    })
})

function getDateRange(start, end) {
    const result = [];
    let date = new Date(start);
    while (date <= new Date(end)) {
        result.push(date.toISOString().split('T')[0]);
        date.setDate(date.getDate() + 1);
    }
    return result;
}

export const requestSchema = Joi.object({
    employee_id: Joi.number().required(),
    leavetype_id: Joi.number().required(),
    start_date: Joi.date().required(),
    end_date: Joi.date().required().custom(async (value, helpers) => {
        const { start_date, employee_id } = helpers.state.ancestors[0];
        if (new Date(value) < new Date(start_date)) {
            return helpers.error('date.invaliRange');
        }
        const DateRange = getDateRange(start_date, value);
        if (DateRange.some(d => {
            const day = new Date(d).getDay();
            return day == 0 || day == 6;
        })) {
            return helpers.error('date.weekend');
        }

        const holidays = await getAllHolidays();
        if (DateRange.some(d => holidays.includes(d))) {
            return helpers.error('date.holiday');
        }


        const booked = await getAllLeaveRequests(employee_id);
        if (DateRange.some(d => booked.includes(d))) {
            return helpers.error('date.booked');
        }
        return value;
    }).messages({
        'date.invalidRange': 'End date must be after start date',
        'date.weekend': 'Leave dates cannot include Saturday or Sunday.',
        'date.holiday': 'Leave dates include company holidays.',
        'date.booked': 'One or more dates are already booked.'
    }),

    reason:Joi.string().min(4).required(),
    status:Joi.string().valid('pending', 'approved', 'rejected','cancelled'),
    is_lop: Joi.boolean().required()
})












