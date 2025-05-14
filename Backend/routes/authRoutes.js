const authController=require('../controllers/authController');

module.exports=[
    {
        method:'POST',
        path:'/api/login',
        handler:authController.login
    }
]











