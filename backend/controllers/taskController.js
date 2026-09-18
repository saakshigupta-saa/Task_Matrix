
const Task = require("../models/Task");
const Project = require("../models/Project");
const Activity = require("../models/Activity");
const Notification = require("../models/Notification");
const { getIO } = require("../socket");

// Create a new task
const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      project,
      assignedTo,
      status,
      priority,
      deadline,
    } = req.body;

    if (!title || !project) {
      return res.status(400).json({
        message: "Task title and project are required",
      });
    }

    const projectExists = await Project.findById(project);

    if (!projectExists) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const isMember =
      projectExists.owner.toString() ===
        req.user._id.toString() ||
      projectExists.members.some(
        (member) =>
          member.toString() === req.user._id.toString()
      );

    if (!isMember) {
      return res.status(403).json({
        message:
          "Not authorized to create a task in this project",
      });
    }

    // Check that the assigned user belongs to the project
    if (assignedTo) {
      const isAssigneeMember =
        projectExists.owner.toString() ===
          assignedTo.toString() ||
        projectExists.members.some(
          (member) =>
            member.toString() === assignedTo.toString()
        );

      if (!isAssigneeMember) {
        return res.status(400).json({
          message:
            "Assigned user must be a member of this project",
        });
      }
    }

    const task = await Task.create({
      title,
      description,
      project,
      assignedTo,
      status,
      priority,
      deadline,
    });

    // Create notification for assignee
    if (assignedTo) {
      await Notification.create({
        user: assignedTo,
        message: `You have been assigned the task "${title}".`,
        type: "task",
      });
    }

    // Create activity for task creation
    await Activity.create({
      project,
      user: req.user._id,
      action: `created the task "${title}"`,
      task: task._id,
    });

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get all tasks for the logged-in user's projects
const getTasks = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { owner: req.user._id },
        { members: req.user._id },
      ],
    }).select("_id");

    const projectIds = projects.map(
      (project) => project._id
    );

    const tasks = await Task.find({
      project: { $in: projectIds },
    })
      .populate("project", "name")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get a single task by ID
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("project", "name")
      .populate("assignedTo", "name email");

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const project = await Project.findById(
      task.project._id
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const isMember =
      project.owner.toString() ===
        req.user._id.toString() ||
      project.members.some(
        (member) =>
          member.toString() === req.user._id.toString()
      );

    if (!isMember) {
      return res.status(403).json({
        message:
          "Not authorized to view this task",
      });
    }

    res.status(200).json({
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Update a task
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const project = await Project.findById(
      task.project
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const isMember =
      project.owner.toString() ===
        req.user._id.toString() ||
      project.members.some(
        (member) =>
          member.toString() === req.user._id.toString()
      );

    if (!isMember) {
      return res.status(403).json({
        message:
          "Not authorized to update this task",
      });
    }

    const {
      title,
      description,
      assignedTo,
      status,
      priority,
      deadline,
    } = req.body;

    // Store old values before updating
    const oldStatus = task.status;
    const oldAssignedTo = task.assignedTo
      ? task.assignedTo.toString()
      : null;

    if (title !== undefined) {
      task.title = title;
    }

    if (description !== undefined) {
      task.description = description;
    }

    // Check that the new assigned user belongs to the project
    if (assignedTo !== undefined) {
      if (assignedTo) {
        const isAssigneeMember =
          project.owner.toString() ===
            assignedTo.toString() ||
          project.members.some(
            (member) =>
              member.toString() ===
              assignedTo.toString()
          );

        if (!isAssigneeMember) {
          return res.status(400).json({
            message:
              "Assigned user must be a member of this project",
          });
        }
      }

      task.assignedTo = assignedTo || null;
    }

    if (status !== undefined) {
      task.status = status;
    }

    if (priority !== undefined) {
      task.priority = priority;
    }

    if (deadline !== undefined) {
      task.deadline = deadline;
    }

    await task.save();

    // Send real-time task update
    const io = getIO();

    io.emit("taskUpdated", {
      taskId: task._id,
      projectId: task.project,
      title: task.title,
      status: task.status,
      priority: task.priority,
      assignedTo: task.assignedTo,
    });

    // Create activity when task status changes
    if (
      status !== undefined &&
      oldStatus !== status
    ) {
      const statusNames = {
        todo: "To Do",
        "in-progress": "In Progress",
        done: "Done",
      };

      await Activity.create({
        project: task.project,
        user: req.user._id,
        action: `moved the task "${task.title}" to ${
          statusNames[status] || status
        }`,
        task: task._id,
      });
    }

    // Create notification when task is assigned
    // to a new member
    if (
      assignedTo !== undefined &&
      assignedTo &&
      oldAssignedTo !== assignedTo.toString()
    ) {
      await Notification.create({
        user: assignedTo,
        message: `You have been assigned the task "${task.title}".`,
        type: "task",
      });
    }

    res.status(200).json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(
      req.params.id
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const project = await Project.findById(
      task.project
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const isMember =
      project.owner.toString() ===
        req.user._id.toString() ||
      project.members.some(
        (member) =>
          member.toString() === req.user._id.toString()
      );

    if (!isMember) {
      return res.status(403).json({
        message:
          "Not authorized to delete this task",
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};

