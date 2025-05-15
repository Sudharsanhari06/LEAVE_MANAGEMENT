
exports.getDashboard = async (request, h) => {
    try {
        const user = request.auth; //credainteds
        console.log("dashboard user",user);
        return h.response({ message: 'Welcome to dashboard!', ...user }).code(200);
    } catch (err) {
        console.error("Dashboard error:", err);
        return h.response({ message: 'Server Error' }).code(500);
    }
};


