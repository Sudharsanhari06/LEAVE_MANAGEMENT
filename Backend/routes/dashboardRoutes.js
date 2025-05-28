const dashboardController=require('../controllers/dashboardController');
const {verifyToken}=require('../middleware/authMiddleware');

module.exports = [
    {
      method: 'GET',
      path: '/api/dashboard',
      options: {
        pre: [
          { method: verifyToken }
        ]
      },
      handler: dashboardController.getDashboard
    }
  ];
  












