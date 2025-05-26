const bcrypt=require('bcrypt');
const  jwt = require('jsonwebtoken');
const  database=require('../config/db');
require('dotenv').config();
exports.login=async(request,h)=>{

    const{email,password}=request.payload;
    try{
        const[rows]= await database.query('SELECT * FROM employees WHERE email=?',[email]);
        if(rows.length==0){
            return h.response({
                message:'User is Not Found'
            }).code(404)
        }
        const user=rows[0];
        const isMatch=await bcrypt.compare(password,user.password);

        if(!isMatch){
            return h.response({ message: 'Invalid credentials'}).code(401)
        }

        const token=jwt.sign({employee_id:user.employee_id,name:user.name,role:user.role},process.env.SECRET_KEY,{
            expiresIn:'1d'
        })

        console.log("tokens",token);
        return h.response({message:'Login successful',token,  is_first_login: user.is_first_login}).code(200);

    }catch(error){
        console.error('Login failed:', error);
        return h.response({ message: 'Server error' }).code(500);
    }

}

exports.changePassword=async(request,h)=>{
    const { oldPassword, newPassword  } = request.payload;

    try {
        const employeeId = request.auth.employee_id;

        const [rows] = await database.query(`SELECT password FROM employees WHERE employee_id = ?`, [employeeId]);
        if (rows.length === 0) {
            return h.response({ message: 'User not found' }).code(404);
        }

        const dbPassword = rows[0].password;

        const isMatch = await bcrypt.compare(oldPassword, dbPassword);
        if (!isMatch) {
            return h.response({ message: 'Old password is incorrect' }).code(401);
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await database.query(`UPDATE employees SET password = ?, is_first_login = FALSE WHERE employee_id = ?`, [hashedPassword, employeeId]);

        return h.response({ message: 'Password updated successfully' }).code(200);

    } catch (error) {
        console.error('Change password error:', error);
        return h.response({ message: 'Server error' }).code(500);
    }
}