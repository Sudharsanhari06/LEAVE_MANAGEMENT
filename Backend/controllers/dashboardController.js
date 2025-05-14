
exports.getDashboard = async (request, h) => {
    const user = request.auth;
    console.log("dashboard user",...user);
    return h.response({ message: 'Welcome to dashboard!', ...user }).code(200);
};
  

