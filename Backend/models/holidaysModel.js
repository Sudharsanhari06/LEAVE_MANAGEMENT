const database=require('../config/db');

exports.addHolidays=async(holiday_name,holiday_date)=>{
    const [holidays]=await database.query('INSERT INTO holidays (holiday_name,holiday_date) VALUES(?,?)',[holiday_name,holiday_date])
    return holidays;
}

exports.getAllHolidays=async()=>{
    const [holidays]=await database.query('SELECT * FROM holidays ORDER BY holiday_id');
    return holidays;
}

exports.updateHolidays=async(holiday_id,holiday_name, holiday_date )=>{
    const[holidays]=await database.query('UPDATE holidays SET holiday_name=?,holiday_date=? WHERE holiday_id=?',[holiday_name, holiday_date ,holiday_id]);
    return holidays;
}

exports.getholidaysuserdate=async(start,end)=>{
    const[rows]=await database.query( `SELECT * FROM holidays WHERE holiday_date BETWEEN ? AND ?`,
        [start, end]);
        return rows;
}