import * as holidayController from '../controllers/holidayController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

export const holidaysRoutes = [
  {
    method: 'POST',
    path: '/holidays',
    handler: holidayController.addHolidays,
  },
  {
    method: 'GET',
    path: '/holidays',
    options: {
      pre: [{ method: verifyToken }],
    },
    handler: holidayController.getAllHolidays,
  },
  {
    method: 'PUT',
    path: '/holidays/{holiday_id}',
    handler: holidayController.updateHolidays,
  },
  {
    method: 'GET',
    path: '/holidays/calender',
    options: {
      pre: [{ method: verifyToken }],
    },
    handler: holidayController.getholidaysuserdate
  }
];

;
