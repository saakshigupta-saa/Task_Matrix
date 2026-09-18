import { useEffect, useState } from "react";
import axios from "axios";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [memberEmail, setMemberEmail] = useState("");
  const [addingMemberId, setAddingMemberId] = useState(null);
  const [memberMessage, setMemberMessage] = useState("");

  // Fetch projects and tasks
  const fetchProjectsAndTasks = async () => {
    try {
      const token = localStorage.getItem("token");

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [projectsResponse, tasksResponse] =
        await Promise.all([
          axios.get(
            "http://localhost:5000/api/projects",
            { headers }
          ),
          axios.get(
            "http://localhost:5000/api/tasks",
            { headers }
          ),
        ]);

      setProjects(
        projectsResponse.data.projects || []
      );

      setTasks(
        tasksResponse.data.tasks || []
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load projects."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectsAndTasks();
  }, []);

  // Calculate project progress
  const getProjectProgress = (projectId) => {
    const projectTasks = tasks.filter(
      (task) => task.project?._id === projectId
    );

    if (projectTasks.length === 0) {
      return 0;
    }

    const completedTasks = projectTasks.filter(
      (task) => task.status === "done"
    ).length;

    return Math.round(
      (completedTasks / projectTasks.length) * 100
    );
  };

  // Handle form input
  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  // Create project
  const handleCreateProject = async (event) => {
    event.preventDefault();

    setCreating(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/projects",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFormData({
        name: "",
        description: "",
      });

      setShowForm(false);

      await fetchProjectsAndTasks();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to create project."
      );
    } finally {
      setCreating(false);
    }
  };

  // Start editing project
  const handleEditProject = (project) => {
    setEditingId(project._id);

    setFormData({
      name: project.name,
      description: project.description || "",
    });

    setShowForm(true);
    setError("");
  };

  // Update project
  const handleUpdateProject = async (event) => {
    event.preventDefault();

    setUpdating(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/projects/${editingId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFormData({
        name: "",
        description: "",
      });

      setEditingId(null);
      setShowForm(false);

      await fetchProjectsAndTasks();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update project."
      );
    } finally {
      setUpdating(false);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);

    setFormData({
      name: "",
      description: "",
    });

    setShowForm(false);
    setError("");
  };

  // Delete project
  const handleDeleteProject = async (projectId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(projectId);
    setError("");

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/projects/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProjects((currentProjects) =>
        currentProjects.filter(
          (project) => project._id !== projectId
        )
      );

      setTasks((currentTasks) =>
        currentTasks.filter(
          (task) => task.project?._id !== projectId
        )
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to delete project."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // Add team member
  const handleAddMember = async (projectId) => {
    if (!memberEmail.trim()) {
      setMemberMessage(
        "Please enter a member email."
      );
      return;
    }

    setAddingMemberId(projectId);
    setMemberMessage("");
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `http://localhost:5000/api/projects/${projectId}/members`,
        {
          email: memberEmail,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMemberMessage(
        response.data.message ||
          "Team member added successfully."
      );

      setMemberEmail("");

      await fetchProjectsAndTasks();
    } catch (error) {
      setMemberMessage(
        error.response?.data?.message ||
          "Failed to add team member."
      );
    } finally {
      setAddingMemberId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Projects
          </h1>

          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Manage and track your projects
          </p>
        </div>

        <button
          onClick={() => {
            if (editingId) {
              handleCancelEdit();
            } else {
              setShowForm(!showForm);
            }
          }}
          className="w-full sm:w-auto bg-blue-600 text-white px-5 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          {showForm ? "Close" : "+ New Project"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm sm:text-base break-words">
          {error}
        </div>
      )}

      {/* Create / Edit Project Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-8 w-full max-w-2xl">
          <h2 className="text-xl font-semibold text-gray-800 mb-5">
            {editingId
              ? "Edit Project"
              : "Create New Project"}
          </h2>

          <form
            onSubmit={
              editingId
                ? handleUpdateProject
                : handleCreateProject
            }
            className="space-y-5"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter project name"
                required
                className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter project description"
                rows="4"
                className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={creating || updating}
                className="w-full sm:w-auto bg-blue-600 text-white px-5 py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {editingId
                  ? updating
                    ? "Saving..."
                    : "Save Changes"
                  : creating
                  ? "Creating..."
                  : "Create Project"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="w-full sm:w-auto bg-gray-100 text-gray-700 px-5 py-3 rounded-lg font-medium hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <p className="text-gray-500">
          Loading projects...
        </p>
      )}

      {/* Empty State */}
      {!loading &&
        !error &&
        projects.length === 0 && (
          <div className="bg-white rounded-xl p-6 sm:p-8 text-center shadow-sm">
            <p className="text-gray-500">
              No projects found.
            </p>
          </div>
        )}

      {/* Projects */}
      {!loading && projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {projects.map((project) => {
            const progress = getProjectProgress(
              project._id
            );

            const projectTaskCount = tasks.filter(
              (task) =>
                task.project?._id === project._id
            ).length;

            return (
              <div
                key={project._id}
                className="bg-white rounded-xl p-4 sm:p-6 shadow-sm min-w-0"
              >
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 break-words">
                  {project.name}
                </h2>

                <p className="text-gray-500 text-sm mt-2 mb-5 break-words">
                  {project.description ||
                    "No description provided"}
                </p>

                {/* Members count */}
                <div className="flex justify-between gap-4 text-sm mb-2">
                  <span className="text-gray-600">
                    Members
                  </span>

                  <span className="font-medium text-gray-800">
                    {project.members?.length || 0}
                  </span>
                </div>

                {/* Member names */}
                {project.members?.length > 0 && (
                  <div className="mb-5 space-y-2">
                    {project.members.map((member) => (
                      <div
                        key={member._id}
                        className="flex items-start gap-2 min-w-0"
                      >
                        <div className="w-8 h-8 shrink-0 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">
                          {member.name
                            ?.split(" ")
                            .map((word) => word[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-800 break-words">
                            {member.name}
                          </p>

                          <p className="text-xs text-gray-500 break-all">
                            {member.email}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Progress */}
                <div className="flex justify-between gap-4 text-sm mb-2">
                  <span className="text-gray-600">
                    Progress
                  </span>

                  <span className="font-medium text-gray-800">
                    {progress}%
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2 mb-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>

                <p className="text-xs text-gray-400 mb-4">
                  {projectTaskCount}{" "}
                  {projectTaskCount === 1
                    ? "task"
                    : "tasks"}
                </p>

                <p className="text-sm text-gray-500 mb-4">
                  Created{" "}
                  {new Date(
                    project.createdAt
                  ).toLocaleDateString()}
                </p>

                {/* Add Member */}
                <div className="border-t pt-4 mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add Team Member
                  </label>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      value={memberEmail}
                      onChange={(event) =>
                        setMemberEmail(
                          event.target.value
                        )
                      }
                      placeholder="Enter member email"
                      className="w-full min-w-0 flex-1 px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        handleAddMember(project._id)
                      }
                      disabled={
                        addingMemberId === project._id
                      }
                      className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {addingMemberId === project._id
                        ? "Adding..."
                        : "Add"}
                    </button>
                  </div>
                </div>

                {memberMessage && (
                  <div className="mb-4 text-sm text-blue-600 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 break-words">
                    {memberMessage}
                  </div>
                )}

                {/* Project Actions */}
                <div className="flex flex-col xs:flex-row sm:flex-row gap-3">
                  <button
                    onClick={() =>
                      handleEditProject(project)
                    }
                    disabled={
                      deletingId === project._id ||
                      updating
                    }
                    className="flex-1 bg-blue-50 text-blue-600 px-4 py-2.5 rounded-lg font-medium hover:bg-blue-100 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDeleteProject(project._id)
                    }
                    disabled={
                      deletingId === project._id ||
                      updating
                    }
                    className="flex-1 bg-red-50 text-red-600 px-4 py-2.5 rounded-lg font-medium hover:bg-red-100 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {deletingId === project._id
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Projects;

