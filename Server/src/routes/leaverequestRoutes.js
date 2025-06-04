import * as leaverequestController from '../controllers/leaverequestController.js'
import { verifyToken } from '../middleware/authMiddleware.js';


export const leaveReaquestRoutes=[
   
     {
        method: 'POST',
        path: '/leaverequest',
        options: {
            pre: [
                { method: verifyToken }
            ],
        },
        handler: leaverequestController.addLeaverequest
    } 
    ,{
        method: 'GET',
        path: '/leaverequest',
        options: {
            pre: [
                { method: verifyToken }
            ]
        },
        handler: leaverequestController.getAllLeaverequest
    },
    {
        method: 'GET',
        path: '/leaverequest/{req_id}',
        options: {
            pre: [
                { method: verifyToken }
            ]
        },
        handler: leaverequestController.getAllLeaverequestById
    },
    // wo
    {  
        method: 'GET',
        path: '/leaverequest/employee/{employee_id}',
        options: {
            pre: [
                { method: verifyToken }
            ]
        },
        handler: leaverequestController.getAllLeaverequestById
    },
    
    // wo
    {
        method: 'PUT',
        path: '/employee/leaverequest/{req_id}',
        options: {
            pre: [
                { method: verifyToken }
            ]
        },
        handler: leaverequestController.cancelLeaverequest
    }
    ,
    {
        method: 'GET',
        path: '/leaverequest/status',
        handler: leaverequestController.getApprovedStatus
    }
    //wo
    ,{
        method: 'GET',
        path: '/leaverequest/statusapproved',
        options:{
            pre:[
                {method:verifyToken}
            ]
        },
        handler:leaverequestController.approvedStatus
    },
    {
        // work
        method:'GET',
        path:'/leaverequest/date-overlap/{employee_id}',
        options:{
            pre:[
                {method:verifyToken}
            ]
        },
        handler:leaverequestController.dateOverlap
    }
]