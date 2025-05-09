const leaverequestModel = require('../models/leaverequestModel');

exports.addLeaverequest = async (request, h) => {
    const { employee_id, leavetype_id, start_date, end_date, reason, status, is_lop } = request.payload;
    try {
        const result = await leaverequestModel.addLeaverequest(employee_id, leavetype_id, start_date, end_date, reason, status, is_lop);
        return h.response(result).code(200);
    } catch (error) {
        console.error('Fail to add leave request', error);
        return h.response({ error: 'Fail to add leaverequest' }).code(500);
    }
}

exports.getAllLeaverequest = async (request, h) => {
    try {
        const result = await leaverequestModel.getAllLeaverequest();
        return h.response(result).code(200);

    } catch (error) {
        console.error('Fail to get leaverequest', error);
        return h.response({ error: "Fail to get leaverequest" }).code(500);
    }
}
exports.getLeaverequestById=async(request,h)=>{
    
    const{req_id}=request.params;
    try{
        const result=await leaverequestModel.getLeaverequestById(req_id);

        if(result.length==0){
            return h.response({error:"The Id is Not Found"}).code(404)
        }
        return h.response({message:"successfully get"}).cdoe(200);
    }catch(error){
        console.log("Failed to get",error);
        return h.response({error:"Fail to get"}).code(500);
    }
}



exports.getAllLeaverequestById = async (request, h) => {
    const { id } = request.params;
    try {
        const result = await leaverequestModel.getAllLeaverequestById(id);
        if(result.affectedRows == 0) {
            return h.response({ error: 'the Employee id is Not found' }).code(404)
        }
        return h.response(result).code(200);
    } catch (error) {
        console.error("Fail to get leaverequest", error);
        return h.response({ error: "Fail to get leaverequest" }).code(500)
        }
}

exports.cancelLeaverequest = async (request, h) => {
    
    const { req_id, emp_id } = request.params;
    try {
        const result = await leaverequestModel.cancelLeaverequest(req_id, emp_id);
        if (req_id.affectedRows == 0 || emp_id.affectedRows == 0) {
            return h.response({ error: "Not Found" }).code(404);
        }
        return h.response({ message: 'Successfully cancel leave request' }).code(200);
    } catch (error) {
        console.error("Fail to cancel leave request", error);
        return h.response({ error: 'Failed cancel leave request' }).code(500)
    }
}


exports.getLeaverequestIdDelete=async(request,h)=>{
    const{req_id}=request.params;
    try{
        const result=await leaverequestModel.getLeaverequestIdDelete(req_id);
        return h.response({message:"successfully deleted"}).code(200)
    }catch(error){
        console.error("Failed to get leaverequest",error);
        return h.response({error:"Failed to get leaverequest"}).code(500)
    }
}






