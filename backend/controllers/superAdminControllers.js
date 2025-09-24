const User = require('../models/User');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find(
            { role: { $ne: 'superAdmin' } },
            { password: 0, submissionHistory: 0 }
        ).sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Server Error: Could not fetch users.", error });
    }
};



const toggleUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const userToUpdate = await User.findById(userId);

        if (!userToUpdate) {
            return res.status(404).json({ message: "User not found." });
        }

        if (userToUpdate.role === 'superAdmin' || userToUpdate._id.equals(req.user.id)) {
            return res.status(403).json({ message: "Forbidden: Cannot change this user's role." });
        }

        userToUpdate.role = userToUpdate.role === 'user' ? 'admin' : 'user';
        await userToUpdate.save();

        res.status(200).json({ message: `User role updated to ${userToUpdate.role}` });
    } catch (error) {
        res.status(500).json({ message: "Server Error: Could not update role.", error });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const userToDelete = await User.findById(userId);

        if (!userToDelete) {
            return res.status(404).json({ message: "User not found." });
        }

        if (userToDelete.role === 'superAdmin' || userToDelete._id.equals(req.user.id)) {
            return res.status(403).json({ message: "Forbidden: Cannot delete this user." });
        }

        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: "User successfully deleted." });
    } catch (error) {
        res.status(500).json({ message: "Server Error: Could not delete user.", error });
    }
};

module.exports = {
    getAllUsers,
    toggleUserRole,
    deleteUser
};