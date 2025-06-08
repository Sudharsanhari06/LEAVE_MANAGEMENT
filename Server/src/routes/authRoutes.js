import * as authController from '../controllers/authController.js'
import { verifyToken } from '../middleware/authMiddleware.js';
import { loginSchema } from '../validators/authSchema.js';


export const authRoutes = [
    // done
    {
        method: 'POST',
        path: '/api/login',
        options:{   
            validate:{
                payload:loginSchema,
                failAction:(request,h,err)=>{
                    return h.response({
                        status: 'fail',
                        message:err.details[0].message
                    }).code(400).takeover();
                }
            }
        },
        handler: authController.login
    }
    
    , {
        method: 'PUT',
        path: '/employee/change-password',
        options: {
            pre: [{
                method: verifyToken
            }],
            handler: authController.changePassword
        }
    }
]











