const authController=require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

module.exports=[
    {
        method:'POST',
        path:'/api/login',
        handler:authController.login
    },{
        method:'PUT',
        path:'/employee/change-password',
        options:{
            pre:[verifyToken],
        handler:authController.changePassword
        }
    }
]











