const verifyAdmin = async (req, res, next) => {
    try {
        console.log("Checking admin role");
        console.log("User role:", req.user.role);

        if (req.user.role === "admin" || req.user.role === "superAdmin") {
            console.log("User is an admin. Proceeding to next middleware.");
            next();
        } else {
            console.log("User is not an admin. Sending Forbidden status.");
            return res.status(403).send("Forbidden: You do not have the necessary permissions.");
        }
    } catch (error) {
        console.log("Error checking admin:", error);
        return res.status(500).send("Internal Server Error: Something went wrong while checking admin.");
    }
};

module.exports = verifyAdmin;
