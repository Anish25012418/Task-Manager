import User from "../models/User.js";
import Task from "../models/Task.js";

// @desc Get all users (Admin only)
// @route method=GET url=/api/users/
// @access Private (Admin)
const getUsers = async (req, res) => {
  try {
    const users = await User.find({role: "member"}).select("-password");

    const usersWithTaskCounts = await Promise.all(users.map(async (user) => {
      const pendingTasks = await Task.countDocuments({assignedTo: user._id, status: "Pending"});
      const inProgressTasks = await Task.countDocuments({assignedTo: user._id, status: "In Progress"});
      const completeTasks = await Task.countDocuments({assignedTo: user._id, status: "Completed"});

      return {
        ...user._doc,
        pendingTasks,
        inProgressTasks,
        completeTasks,
      }
    }))
    res.json(usersWithTaskCounts);
  }catch(err) {
    res.status(500).json({message: "Server error", error: err.message});
  }
}

// @desc Get user by ID
// @route method=GET url=/api/users/:id
// @access Private
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({message: "User not found"});
    }
    res.status(200).json(user)
  }catch(err) {
    res.status(500).json({message: "Server error", error: err.message});
  }
}


export {getUsers, getUserById}

