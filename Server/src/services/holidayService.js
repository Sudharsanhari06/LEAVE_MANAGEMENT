import { AppDataSource } from '../config/db.js';
import { Holiday } from '../entities/Holiday.js';
import { Between } from "typeorm";

export const addHoliday = async (holiday_name, holiday_date) => {
  const holidayRepo = AppDataSource.getRepository(Holiday);
  const newHoliday = holidayRepo.create({ holiday_name, holiday_date });
  return await holidayRepo.save(newHoliday);
};

export const getAllHolidays = async () => {
  const holidayRepo = AppDataSource.getRepository(Holiday);
  return await holidayRepo.find({ order: { holiday_id: 'ASC' } });
};

export const updateHoliday = async (holiday_id, holiday_name, holiday_date) => {
  const holidayRepo = AppDataSource.getRepository(Holiday);
  const result = await holidayRepo.update(holiday_id, { holiday_name, holiday_date });
  return result;
};
export const getHolidaysByDateRange = async (start, end) => {
  const holidayRepo = AppDataSource.getRepository(Holiday);
  return await holidayRepo.find({
    where: {
      holiday_date: Between(start, end),
    },
  });
};
