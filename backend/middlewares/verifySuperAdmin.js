const verifySuperAdmin = (req, res, next) => {

    console.log("Verifying Super Admin role for user:", req.user);
    if (req.user && req.user.role === 'superAdmin') {
        return next();
    }

    return res.status(403).json({ message: "Forbidden: Access denied. Requires Super Admin role." });
};

module.exports = verifySuperAdmin;