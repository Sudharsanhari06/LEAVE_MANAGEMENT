const holidaysController=require('../controllers/holidaysController');

const holidaysRoutes=[
    {
        method:'POST',
        path:'/holidays',
        handler:holidaysController.addHolidays
    },{
        method:'GET',
        path:'/holidays',
        handler:holidaysController.getAllHolidays
    },{
        method:'PUT',
        path:'/holidays/{holiday_id}',
        handler:holidaysController.updateHolidays 
    }

]
module.exports=holidaysRoutes;



