const checkAdmin = async (req, res, next) => {
    try {
        // console.log(req.user.role);
        if (req.user.role === "admin") {
            next();
        } else {
            res.status(403).send("Forbidden: You do not have the necessary permissions.");
        }
    } catch (error) {
        res.status(500).send("Internal Server Error: Something went wrong while checking admin.");
    }
};

module.exports = checkAdmin ;