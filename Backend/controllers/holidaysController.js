const holidaysModel = require('../models/holidaysModel');


exports.addHolidays = async (request, h) => {

    const { holiday_name, holiday_date } = request.payload;
    try {
        const result = await holidaysModel.addHolidays(holiday_name, holiday_date);
        return h.response({ message: "successfully added", result }).code(200);
    } catch (error) {
        console.error("Internal server error", error);
        return h.response({ message: 'Server error' }).code(500)
    }
}

exports.getAllHolidays = async (request, h) => {
    try {
        const result = await holidaysModel.getAllHolidays();
        return h.response({ message: "Successfully get All Holidays", result }).code(200)
    } catch (error) {
        console.error("server error", error);
        return h.response({ message: 'Internal server error' }).code(500);
    }
}

exports.updateHolidays = async (request, h) => {
    const { holiday_id } = request.params;
    const { holiday_name, holiday_date } = request.payload;
    
    try {
        const result = await holidaysModel.updateHolidays(holiday_id,holiday_name, holiday_date );
        if (result.affectedRows == 0) {
            return h.response({ message: 'Holidays is Not Found' }).code(200);
        }
        return h.response({ message: "Successfully updates", result }).code(200);

    } catch (error) {
        console.error("server error", error);
        return h.response({ message: "server error" }).code(500)
    }
}






