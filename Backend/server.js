require('dotenv').config();
const Hapi = require('@hapi/hapi');
const employeeRoutes = require('./routes/employeesRoutes');
const leaveTypesRoute = require('./routes/leavetypesRoutes');
const leavebalanceRoutes = require('./routes/leavebalanceRoutes');
const leaverequestRoutes = require('./routes/leaverequestRoutes');
const leaveapprovalRoutes=require('./routes/leaveapprovalsRoutes');
const authRoutes=require('./routes/authRoutes');

async function initial() {
    const server = Hapi.server(
        {
            port: 3003,
            host: 'localhost'
        });
        
    server.route(employeeRoutes);
    server.route(leaveTypesRoute);
    server.route(leavebalanceRoutes);
    server.route(leaverequestRoutes);
    server.route(leaveapprovalRoutes);
    server.route(authRoutes);

    await server.start();
    console.log("Server is running:", server.info.uri)
}
initial();
