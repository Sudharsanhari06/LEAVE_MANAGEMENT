const leaverequestController = require('../controllers/leaverequestController');

const leaverequestRoutes = [
    {
        method: 'POST',
        path: '/leaverequest',
        handler: leaverequestController.addLeaverequest
    },
    {
        method: 'GET',
        path: '/leaverequest',
        handler: leaverequestController.getAllLeaverequest
    }, 
    {
        method: 'GET',
        path: '/leaverequest/{id}/',
        handler: leaverequestController.getLeaverequestById
    }
    ,
    {
        method: 'GET',
        path: '/leaverequest/employee/{id}',
        handler: leaverequestController.getAllLeaverequestById
    }, {
        method: 'PUT',
        path: '/employee/{emp_id}/leaverequest/{req_id}',
        handler: leaverequestController.cancelLeaverequest
    }
    ,{
        method: 'DELETE',
        path: '/leaverequest/{id}/delete',
        handler: leaverequestController.getLeaverequestIdDelete     
    }
]
module.exports = leaverequestRoutes;




