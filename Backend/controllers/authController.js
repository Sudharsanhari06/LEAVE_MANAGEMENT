const bcrypt=require('bcrypt');
const  jwt = require('jsonwebtoken');
const  db=require('../config/db');
exports.login=async(request,h)=>{
    const{email,password}=request.payload;
    try{
        const[rows]= await db.query('SELECT * FROM employees WHERE email=?',[email]);
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

        const token=jwt.sign({employee_id:user.employee_id,role:user.role},process.env.SECRET_KEY,{
            expiresIn:'1h'
        })

        return h.response({message:'Login successful',token}).code(200);

    }catch(error){
        console.error('Login failed:', err);
        return h.response({ message: 'Server error' }).code(500);
    }


}
