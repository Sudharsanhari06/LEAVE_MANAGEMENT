const holidaysController=require('../controllers/holidaysController');
const {verifyToken,allowRoles}=require('../middleware/authMiddleware');


const holidaysRoutes=[
    {
        method:'POST',
        path:'/holidays',
        handler:holidaysController.addHolidays
    },{
        method:'GET',
        path:'/holidays',
        options: {
            pre: [
                { method: verifyToken }
            ]
        },
        handler:holidaysController.getAllHolidays
    },{
        method:'PUT',
        path:'/holidays/{holiday_id}',
        handler:holidaysController.updateHolidays 
    }

]
module.exports=holidaysRoutes;



