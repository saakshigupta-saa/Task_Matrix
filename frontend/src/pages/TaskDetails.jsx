import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedTo: "",
    status: "todo",
    priority: "medium",
    deadline: "",
  });

  const fetchTask = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/api/tasks/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const fetchedTask = response.data.task;

      setTask(fetchedTask);

      setFormData({
        title: fetchedTask.title || "",
        description: fetchedTask.description || "",
        assignedTo: fetchedTask.assignedTo?._id || "",
        status: fetchedTask.status || "todo",
        priority: fetchedTask.priority || "medium",
        deadline: fetchedTask.deadline
          ? new Date(fetchedTask.deadline)
              .toISOString()
              .split("T")[0]
          : "",
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load task details."
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

      setProjects(response.data.projects || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load project members."
      );
    }
  };

  useEffect(() => {
    fetchTask();
    fetchProjects();
  }, [id]);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleEdit = () => {
    setError("");
    setSuccess("");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setError("");
    setSuccess("");

    setFormData({
      title: task.title || "",
      description: task.description || "",
      assignedTo: task.assignedTo?._id || "",
      status: task.status || "todo",
      priority: task.priority || "medium",
      deadline: task.deadline
        ? new Date(task.deadline)
            .toISOString()
            .split("T")[0]
        : "",
    });

    setIsEditing(false);
  };

  const handleUpdateTask = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${API_URL}/api/tasks/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Task updated successfully.");
      setIsEditing(false);

      await fetchTask();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update task."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTask = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `${API_URL}/api/tasks/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/tasks");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to delete task."
      );
      setDeleting(false);
    }
  };

  const getStatusLabel = (status) => {
    if (status === "in-progress") return "In Progress";
    if (status === "done") return "Done";
    return "To Do";
  };

  const getStatusStyle = (status) => {
    if (status === "done") {
      return "bg-green-100 text-green-700";
    }

    if (status === "in-progress") {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-gray-100 text-gray-700";
  };

  const getPriorityStyle = (priority) => {
    if (priority === "high") {
      return "text-red-600";
    }

    if (priority === "low") {
      return "text-green-600";
    }

    return "text-yellow-600";
  };

  // Find the project connected to this task
  const selectedProject = projects.find(
    (project) => project._id === task?.project?._id
  );

  // Get owner + project members
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-500">
            Loading task details...
          </p>
        </div>
      </div>
    );
  }

  if (error && !task) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 mb-6">
            {error}
          </div>

          <Link
            to="/tasks"
            className="text-blue-600 font-medium hover:underline"
          >
            ← Back to Tasks
          </Link>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-500">
            Task not found.
          </p>

          <Link
            to="/tasks"
            className="text-blue-600 font-medium hover:underline"
          >
            ← Back to Tasks
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">

        {/* Back */}
        <div className="mb-6">
          <Link
            to="/tasks"
            className="text-blue-600 font-medium hover:underline"
          >
            ← Back to Tasks
          </Link>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">
              {task.project?.name || "No project"}
            </p>

            <h1 className="text-3xl font-bold text-gray-800">
              {task.title}
            </h1>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-sm font-medium w-fit ${getStatusStyle(
              task.status
            )}`}
          >
            {getStatusLabel(task.status)}
          </span>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 rounded-lg px-4 py-3 mb-6">
            {success}
          </div>
        )}

        {/* Edit Form */}
        {isEditing ? (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-5">
              Edit Task
            </h2>

            <form
              onSubmit={handleUpdateTask}
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
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
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
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">
                    Not assigned
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

                {projectMembers.length === 0 && (
                  <p className="text-xs text-gray-500 mt-2">
                    No project members available.
                  </p>
                )}
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Task Details */
          <div className="bg-white rounded-xl shadow-sm p-6">

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Description
              </h2>

              <p className="text-gray-600">
                {task.description ||
                  "No description provided."}
              </p>
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">

              {/* Assigned */}
              <div>
                <p className="text-sm text-gray-500">
                  Assigned To
                </p>

                <p className="font-medium text-gray-800 mt-1">
                  {task.assignedTo?.name ||
                    "Not assigned"}
                </p>
              </div>

              {/* Priority */}
              <div>
                <p className="text-sm text-gray-500">
                  Priority
                </p>

                <p
                  className={`font-medium mt-1 capitalize ${getPriorityStyle(
                    task.priority
                  )}`}
                >
                  {task.priority || "Medium"}
                </p>
              </div>

              {/* Deadline */}
              <div>
                <p className="text-sm text-gray-500">
                  Deadline
                </p>

                <p className="font-medium text-gray-800 mt-1">
                  {task.deadline
                    ? new Date(
                        task.deadline
                      ).toLocaleDateString()
                    : "No deadline"}
                </p>
              </div>

              {/* Project */}
              <div>
                <p className="text-sm text-gray-500">
                  Project
                </p>

                <p className="font-medium text-gray-800 mt-1">
                  {task.project?.name ||
                    "No project"}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 border-t pt-6">
              <button
                onClick={handleEdit}
                className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Edit Task
              </button>

              <button
                onClick={handleDeleteTask}
                disabled={deleting}
                className="bg-red-50 text-red-600 px-5 py-2.5 rounded-lg font-medium hover:bg-red-100 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {deleting
                  ? "Deleting..."
                  : "Delete Task"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskDetails;

