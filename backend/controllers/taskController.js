import Task from "../models/Task.js";

const statusWiseTasks = async (filter, status, user) => {
  return Task.countDocuments({
    ...filter, status: status, ...(user.role !== "admin" && {assignedTo: user._id})
  });
}


// @desc Get all tasks (Admin: all, User: only assigned tasks)
// @route method=GET url=/api/tasks
// @access Private
const getTasks = async (req, res) => {
  try {
    const {status} = req.query;
    let filter = {}
    if (status) {
      filter.status = status;
    }
    let tasks;
    const findQuery = req.user.role === "admin" ? filter : {...filter, assignedTo: req.user._id};
    tasks = await Task.find(findQuery).populate("assignedTo", "name email profileImageUrl");

    //Adding completed todoChecklist count to each task
    tasks = await Promise.all(
      tasks.map(async task => {
        const completedCount = task.todoChecklist.filter(
          (item) => item.completed
        ).length;
        return {...task, completedCount: completedCount};
      })
    );

    //Status summary counts
    const allTasks = await Task.countDocuments(
      req.user.role === "admin" ? {} : {assignedTo: req.user._id}
    );

    const pendingTasks = await statusWiseTasks(filter, "Pending", req.user);
    const inProgressTasks = await statusWiseTasks(filter, "In Progress", req.user);
    const completedTasks = await statusWiseTasks(filter, "Completed", req.user);

    res.json({
      tasks,
      statusSummary: {
        allTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
      }
    })

  } catch (err) {
    res.status(400).json({message: "Server error", error: err.message});
  }
}

// @desc Get task by ID
// @route method=GET url=/api/tasks/:id
// @access Private
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("assignedTo", "name email profileImageUrl");

    if (!task) return res.status(404).json({message: "Task not found"});
    return res.status(200).json({message: "Task found successfully.", task});

  } catch (err) {
    res.status(400).json({message: "Server error", error: err.message});
  }
}

// @desc Create new Task
// @route method=POST url=/api/tasks
// @access Private (Admin)
const createTask = async (req, res) => {
  try {
    const {title, description, priority, dueDate, assignedTo, attachments, todoChecklist} = req.body;

    if (!Array.isArray(assignedTo)) {
      return res.status(400).json({message: "assignedTo must be an array of user IDs"});
    }

    const task = await Task.create({
      title, description, priority, dueDate, assignedTo, attachments, todoChecklist, createdBy: req.user._id
    });

    res.status(201).json({message: "Task created successfully.", task});
  } catch (err) {
    res.status(400).json({message: "Server error", error: err.message});
  }
}

// @desc Update task detail
// @route method=PUT url=/api/tasks/:id
// @access Private
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
    if (!task) return res.status(404).json({message: "Task not found"});

    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.priority = req.body.priority || task.priority;
    task.dueDate = req.body.dueDate || task.dueDate;
    task.todoChecklist = req.body.todoChecklist || task.todoChecklist;
    task.attachments = req.body.attachments || task.attachments;

    if (req.body.assignedTo) {
      if (!Array.isArray(req.body.assignedTo)) {
        return res.status(400).json({message: "assignedTo must be an array of user IDs"});
      }
      task.assignedTo = req.body.assignedTo;
    }
    const updateTask = await task.save();
    res.status(201).json({message: "Task updated successfully.", updateTask});
  } catch (err) {
    res.status(400).json({message: "Server error", error: err.message});
  }
}

// @desc Delete task
// @route method=DELETE url=/api/tasks/:id
// @access Private (Admin)
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
    if (!task) return res.status(404).json({message: "Task not found"});
    await task.deleteOne()
    res.status(200).json({message: "Task deleted successfully."});
  } catch (err) {
    res.status(400).json({message: "Server error", error: err.message});
  }
}

// @desc Update task status
// @route method=PUT url=/api/tasks/:id/status
// @access Private
const updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({message: "Task not found"});

    const isAssigned = task.assignedTo.some((userId) => userId.toString() === req.user._id.toString());

    if(!isAssigned && req.user.role !== "admin") {
      return res.status(403).json({message: "Not authorized"});
    }

    task.status = req.body.status || task.status;

    if (task.status === "Completed") {
      task.todoChecklist.forEach((item) => (item.completed = true));
      task.progress = 100;
    }

    await task.save();
    res.json({message: "Task status updated successfully.", task});
  } catch (err) {
    res.status(400).json({message: "Server error", error: err.message});
  }
}

// @desc Update task checklist
// @route method=PUT url=/api/tasks/:id/todo
// @access Private
const updateTaskChecklist = async (req, res) => {
  try {
    const {todoCheckList} = req.body;
    const task = await Task.findById(req.params.id)

    if (!task) return res.status(404).json({message: "Task not found"});

    if (!task.assignedTo.includes(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({message: "Not authorized to update checklist"});
    }
    task.todoChecklist = todoCheckList;

    //Auto-update progress based on checklist completion
    const completedCount = task.todoChecklist.filter(
      (item) => item.completed
    ).length;
    const totalItems = task.todoChecklist.length
    task.progress = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

    //Auto-mark task as completed
    if (task.progress === 100){
      task.status = "Completed"
    }else if(task.progress > 0){
      task.status = "In Progress"
    }else {
      task.status = "Pending"
    }
    await task.save()
    const updatedTask = await Task.findById(req.params.id).populate("assignedTo", "name email profileImageUrl");
    res.status(200).json({message: "Task checklist updated successfully.", task: updatedTask});
  } catch (err) {
    res.status(400).json({message: "Server error", error: err.message});
  }
}

// @desc Dashboard data (Admin only)
// @route method=GET url=/api/tasks/dashboard-data
// @access Private
const getDashboardData = async (req, res) => {
  try {
    //Fetching stats
    const totalTasks = await Task.countDocuments();
    const pendingTasks = await Task.countDocuments({status: "Pending"});
    const completedTasks = await Task.countDocuments({status: "Pending"});
    const overdueTasks = await Task.countDocuments({
      status: {$ne: "Completed"},
      dueDate: {$lt: new Date()},
    });

    const taskStatuses = ["Completed", "In Progress", "Pending"];
    const taskDistributionRaw = await Task.aggregate([
      {
        $group: {
          _id: "$status",
          count: {$sum: 1},
        }
      }
    ])
    const taskDistribution = taskStatuses.reduce((acc, status) => {
      const formattedKey = status.replace(/\s+/g, "");
      acc[formattedKey] = taskDistributionRaw.find((item) => item._id === status)?.count || 0;
      return acc;
    }, {});
    taskDistribution["All"] = totalTasks;

    //Ensuring all priority levels are included
    const taskPriorities = ["Low", "Medium", "High"];
    const taskPriorityLevelsRaw = await Task.aggregate([
      {
        $group: {
          _id: "$priority",
          count: {$sum: 1},
        }
      }
    ])
    const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
      acc[priority] = taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0;
      return acc
    }, {})

    //Fetching recent 10 tasks
    const recentTasks = await Task.find().sort({createdAt: -1}).limit(10).select("title status priority dueDate createdAt");

    res.status(200).json({
      statistics: {
        totalTasks,
        pendingTasks,
        completedTasks,
        overdueTasks
      },
      charts: {
        taskDistribution,
        taskPriorityLevels
      },
      recentTasks,
    })

  } catch (err) {
    res.status(400).json({message: "Server error", error: err.message});
  }
}

// @desc Dashboard data (User-specific)
// @route method=GET url=/api/tasks/user-dashboard-data
// @access Private
const getUserDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;

    //Fetching stats for user-specific tasks
    const totalTasks = await Task.countDocuments({ assignedTo: userId });
    const pendingTasks = await Task.countDocuments({ assignedTo: userId, status: "Pending"});
    const completedTasks = await Task.countDocuments({ assignedTo: userId, status: "Completed"});
    const overdueTasks = await Task.countDocuments({ assignedTo: userId, status: {$ne: "Completed"}, dueDate: {$lt: new Date()}});

    //Task Distribution by status
    const taskStatuses = ["Completed", "In Progress", "Pending"];

    const taskDistributionRaw = await Task.aggregate([
      {$match: { assignedTo: userId}},
      {$group: {_id: "$status", count: {$sum: 1}}}
    ]);

    const taskDistribution = taskStatuses.reduce((acc, status) => {
      const formattedKey = status.replace(/\s+/g, "");
      acc[formattedKey] = taskDistributionRaw.find((item) => item._id === status)?.count || 0;
      return acc;
    }, {});
    taskDistribution["All"] = totalTasks;

    //Task distribution by priority
    const taskPriorities = ["Low", "Medium", "High"];
    const taskPriorityLevelsRaw = await Task.aggregate([
      {$match: { assignedTo: userId}},
      {$group: {_id: "$priority", count: {$sum: 1}}}
    ])
    const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
      acc[priority] = taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0;
    }, {})

    //Fetching recent 10 tasks
    const recentTasks = await Task.find({ assignedTo: userId}).sort({createdAt: -1}).limit(10).select("title status priority dueDate createdAt");
    res.status(200).json({
      statistics: {
        totalTasks,
        pendingTasks,
        completedTasks,
        overdueTasks
      },
      charts: {
        taskDistribution,
        taskPriorityLevels
      },
      recentTasks,
    })
  } catch (err) {
    res.status(400).json({message: "Server error", error: err.message});
  }
}

export {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskChecklist,
  getDashboardData,
  getUserDashboardData
}