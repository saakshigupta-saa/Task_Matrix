import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import {
  DndContext,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

function DraggableTask({ task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: task._id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 50,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`touch-none ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <Link
        to={`/tasks/${task._id}`}
        onClick={(event) => {
          if (isDragging) {
            event.preventDefault();
          }
        }}
        className="block bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-grab active:cursor-grabbing"
      >
        <h3 className="font-semibold text-gray-800 break-words">
          {task.title}
        </h3>

        <p className="text-xs text-gray-500 mt-2 break-words">
          {task.project?.name || "No project"}
        </p>

        <div className="mt-3">
          <span
            className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${
              task.priority === "high"
                ? "bg-red-100 text-red-600"
                : task.priority === "medium"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-600"
            }`}
          >
            {task.priority
              ? task.priority.charAt(0).toUpperCase() +
                task.priority.slice(1)
              : "Medium"}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t">
          <div className="w-8 h-8 shrink-0 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">
            {task.assignedTo?.name
              ? task.assignedTo.name
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()
              : "NA"}
          </div>

          <span className="text-xs text-gray-500 text-right">
            {task.deadline
              ? `Due ${new Date(
                  task.deadline
                ).toLocaleDateString()}`
              : "No deadline"}
          </span>
        </div>
      </Link>
    </div>
  );
}

function DroppableColumn({
  column,
  tasks,
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.status,
  });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-xl p-4 min-h-[300px] w-[280px] sm:w-auto shrink-0 transition ${
        isOver ? "bg-blue-100" : "bg-gray-200"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          {column.title}
        </h2>

        <span className="bg-white text-gray-600 text-sm px-2.5 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>

      <div className="space-y-4">
        {tasks.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-6">
            Drop tasks here
          </p>
        )}

        {tasks.map((task) => (
          <DraggableTask
            key={task._id}
            task={task}
          />
        ))}
      </div>
    </div>
  );
}

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    project: "",
    assignedTo: "",
    status: "todo",
    priority: "medium",
    deadline: "",
  });

  const [updatingTaskId, setUpdatingTaskId] =
    useState(null);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/api/tasks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks(response.data.tasks || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load tasks."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/api/projects`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProjects(
        response.data.projects || []
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load projects."
      );
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, []);

  // Listen for real-time task updates
  useEffect(() => {
    const socket = io(API_URL);

    socket.on("taskUpdated", (updatedTask) => {
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task._id === updatedTask.taskId
            ? {
                ...task,
                status: updatedTask.status,
                priority: updatedTask.priority,
                assignedTo: updatedTask.assignedTo,
              }
            : task
        )
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,

      ...(name === "project" && {
        assignedTo: "",
      }),
    });
  };

  const handleCreateTask = async (event) => {
    event.preventDefault();

    setCreating(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${API_URL}/api/tasks`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFormData({
        title: "",
        description: "",
        project: "",
        assignedTo: "",
        status: "todo",
        priority: "medium",
        deadline: "",
      });

      setShowForm(false);

      await fetchTasks();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to create task."
      );
    } finally {
      setCreating(false);
    }
  };

  // Update task status after drag and drop
  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const taskId = active.id;
    const newStatus = over.id;

    const validStatuses = [
      "todo",
      "in-progress",
      "done",
    ];

    if (!validStatuses.includes(newStatus)) {
      return;
    }

    const currentTask = tasks.find(
      (task) => task._id === taskId
    );

    if (!currentTask) {
      return;
    }

    if (currentTask.status === newStatus) {
      return;
    }

    const previousStatus = currentTask.status;

    // Update UI immediately
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task._id === taskId
          ? {
              ...task,
              status: newStatus,
            }
          : task
      )
    );

    setUpdatingTaskId(taskId);
    setError("");

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${API_URL}/api/tasks/${taskId}`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      // Restore previous status if API update fails
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task._id === taskId
            ? {
                ...task,
                status: previousStatus,
              }
            : task
        )
      );

      setError(
        error.response?.data?.message ||
          "Failed to update task status."
      );
    } finally {
      setUpdatingTaskId(null);
    }
  };

  // Get selected project
  const selectedProject = projects.find(
    (project) => project._id === formData.project
  );

  // Get project members
  const projectMembers = selectedProject
    ? [
        ...(selectedProject.owner
          ? [selectedProject.owner]
          : []),
        ...(selectedProject.members || []),
      ].filter(
        (member, index, array) =>
          member?._id &&
          array.findIndex(
            (item) => item._id === member._id
          ) === index
      )
    : [];

  const columns = [
    {
      title: "To Do",
      status: "todo",
    },
    {
      title: "In Progress",
      status: "in-progress",
    },
    {
      title: "Done",
      status: "done",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Tasks
          </h1>

          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Manage tasks using the Kanban board
          </p>
        </div>

        <button
          onClick={() =>
            setShowForm(!showForm)
          }
          className="w-full sm:w-auto bg-blue-600 text-white px-5 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          {showForm ? "Close" : "+ New Task"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm sm:text-base">
          {error}
        </div>
      )}

      {/* Updating indicator */}
      {updatingTaskId && (
        <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-600 rounded-lg px-4 py-3 text-sm sm:text-base">
          Updating task status...
        </div>
      )}

      {/* Create Task Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-8 w-full max-w-2xl">
          <h2 className="text-xl font-semibold text-gray-800 mb-5">
            Create New Task
          </h2>

          <form
            onSubmit={handleCreateTask}
            className="space-y-5"
          >
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Title
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter task title"
                required
                className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter task description"
                rows="4"
                className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Project */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project
              </label>

              <select
                name="project"
                value={formData.project}
                onChange={handleChange}
                required
                className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">
                  Select a project
                </option>

                {projects.map((project) => (
                  <option
                    key={project._id}
                    value={project._id}
                  >
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Assigned To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assigned To
              </label>

              <select
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                disabled={!formData.project}
                className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">
                  {formData.project
                    ? "Select a team member"
                    : "Select a project first"}
                </option>

                {projectMembers.map((member) => (
                  <option
                    key={member._id}
                    value={member._id}
                  >
                    {member.name} ({member.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="todo">
                  To Do
                </option>

                <option value="in-progress">
                  In Progress
                </option>

                <option value="done">
                  Done
                </option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>

              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="low">
                  Low
                </option>

                <option value="medium">
                  Medium
                </option>

                <option value="high">
                  High
                </option>
              </select>
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deadline
              </label>

              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={creating}
                className="w-full sm:w-auto bg-blue-600 text-white px-5 py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {creating
                  ? "Creating..."
                  : "Create Task"}
              </button>

              <button
                type="button"
                onClick={() =>
                  setShowForm(false)
                }
                className="w-full sm:w-auto bg-gray-100 text-gray-700 px-5 py-3 rounded-lg font-medium hover:bg-gray-200 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <p className="text-gray-500">
          Loading tasks...
        </p>
      )}

      {/* Kanban Board */}
      {!loading && !error && (
        <DndContext onDragEnd={handleDragEnd}>
          <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto md:overflow-visible pb-4">
            {columns.map((column) => {
              const columnTasks = tasks.filter(
                (task) =>
                  task.status === column.status
              );

              return (
                <DroppableColumn
                  key={column.status}
                  column={column}
                  tasks={columnTasks}
                />
              );
            })}
          </div>
        </DndContext>
      )}
    </div>
  );
}

export default Tasks;

