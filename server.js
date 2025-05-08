require('dotenv').config();
const Hapi = require('@hapi/hapi');
const employeeRoutes = require('./routes/employeesRoutes');
const leaveTypesRoute = require('./routes/leavetypesRoutes');
const leavebalanceRoutes = require('./routes/leavebalanceRoutes');
const leaverequestRoutes = require('./routes/leaverequestRoutes');


async function initial() {
    const server = Hapi.server(
        {
            port: 3002,
            host: 'localhost'
        });

    server.route(employeeRoutes);
    server.route(leaveTypesRoute);
    server.route(leavebalanceRoutes);
    server.route(leaverequestRoutes);
    await server.start();
    console.log("Server is running:", server.info.uri)
}
initial();
