import * as holidayService from '../services/holidayService.js';

export const addHolidays = async (request, h) => {
  const { holiday_name, holiday_date } = request.payload;
  try {
    const result = await holidayService.addHoliday(holiday_name, holiday_date);
    return h.response({ message: 'Successfully added', result }).code(200);
  } catch (error) {
    console.error('Internal server error', error);
    return h.response({ message: 'Server error' }).code(500);
  }
};

export const getAllHolidays = async (request, h) => {
  try {
    const result = await holidayService.getAllHolidays();
    return h.response({ message: 'Successfully got all holidays', result }).code(200);
  } catch (error) {
    console.error('Server error', error);
    return h.response({ message: 'Internal server error' }).code(500);
  }
};

export const updateHolidays = async (request, h) => {
  const { holiday_id } = request.params;
  const { holiday_name, holiday_date } = request.payload;
  try {
    const result = await holidayService.updateHoliday(holiday_id, holiday_name, holiday_date);
    if (result.affected === 0) {
      return h.response({ message: 'Holiday not found' }).code(404);
    }
    return h.response({ message: 'Successfully updated', result }).code(200);
  } catch (error) {
    console.error('Server error', error);
    return h.response({ message: 'Server error' }).code(500);
  }
};

export const getholidaysuserdate = async (request, h) => {
  const { start, end } = request.query;
  console.log(" start, end", start, end)
  try {
    const result = await holidayService.getHolidaysByDateRange(start, end);
    return h.response({ message: 'Successfully retrieved', result }).code(200);
  } catch (error) {
    console.error('Failed to get holidays by date range', error);
    return h.response({ message: 'Internal Server Error' }).code(500);
  }
};
