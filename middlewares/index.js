const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).json({ message: "Unauthenticated" });
    }
};

const isAuthorized = (req, res, next, role) => {
    if (req.user.role.includes(role)) {
        next();
    } else {
        res.status(401).json({ message: "Unauthorized to do this action" });
    }
};

module.exports = { isAuthenticated, isAuthorized };
