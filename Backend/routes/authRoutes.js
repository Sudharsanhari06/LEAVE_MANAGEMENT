const authController=require('../controllers/authController');

module.exports=[
    {
        method:'POST',
        path:'/api/auth/login',
        handler:authController.login
    }
]











