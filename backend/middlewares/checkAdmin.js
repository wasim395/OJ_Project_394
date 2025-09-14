const checkAdmin = async (req, res, next) => {
    try {
        console.log("Checking admin role");
        console.log("User role:", req.user.role);

        if (req.user.role === "admin") {
            console.log("User is an admin. Proceeding to next middleware.");
            next();
        } else {
            console.log("User is not an admin. Sending Forbidden status.");
            res.send(496 , "Forbidden: You do not have the necessary permissions.") ;
        }
    } catch (error) {
        console.log("Error checking admin:", error);
        res.send(500 , "Internal Server Error: Something went wrong while checking admin.");
    }
};

module.exports = checkAdmin;
