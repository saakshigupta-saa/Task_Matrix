import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [
        projectsResponse,
        tasksResponse,
        activitiesResponse,
      ] = await Promise.all([
        axios.get(`${API_URL}/api/projects`, {
          headers,
        }),
        axios.get(`${API_URL}/api/tasks`, {
          headers,
        }),
        axios.get(`${API_URL}/api/activities`, {
          headers,
        }),
      ]);

      setProjects(projectsResponse.data.projects || []);
      setTasks(tasksResponse.data.tasks || []);
      setActivities(
        activitiesResponse.data.activities || []
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const totalProjects = projects.length;
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "done"
  ).length;

  const overdueTasks = tasks.filter((task) => {
    if (!task.deadline || task.status === "done") {
      return false;
    }

    return new Date(task.deadline) < new Date();
  }).length;

  const getProjectProgress = (projectId) => {
    const projectTasks = tasks.filter(
      (task) => task.project?._id === projectId
    );

    if (projectTasks.length === 0) {
      return 0;
    }

    const completed = projectTasks.filter(
      (task) => task.status === "done"
    ).length;

    return Math.round(
      (completed / projectTasks.length) * 100
    );
  };

  const activeProjects = projects
    .map((project) => ({
      ...project,
      progress: getProjectProgress(project._id),
    }))
    .filter((project) => project.progress < 100)
    .slice(0, 5);

  const upcomingDeadlines = tasks
    .filter(
      (task) =>
        task.deadline &&
        task.status !== "done" &&
        new Date(task.deadline) >= new Date()
    )
    .sort(
      (a, b) =>
        new Date(a.deadline) - new Date(b.deadline)
    )
    .slice(0, 3);

  const getDeadlineText = (deadline) => {
    const today = new Date();
    const dueDate = new Date(deadline);

    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    const difference = Math.ceil(
      (dueDate - today) /
        (1000 * 60 * 60 * 24)
    );

    if (difference === 0) {
      return "Due today";
    }

    if (difference === 1) {
      return "Due tomorrow";
    }

    return `Due in ${difference} days`;
  };

  const getDeadlineStyle = (deadline) => {
    const today = new Date();
    const dueDate = new Date(deadline);

    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    const difference = Math.ceil(
      (dueDate - today) /
        (1000 * 60 * 60 * 24)
    );

    if (difference <= 1) {
      return "border-red-500";
    }

    if (difference <= 3) {
      return "border-yellow-500";
    }

    return "border-green-500";
  };

  const getActivityTime = (createdAt) => {
    if (!createdAt) {
      return "";
    }

    const createdTime = new Date(createdAt);
    const currentTime = new Date();

    const differenceInSeconds = Math.floor(
      (currentTime - createdTime) / 1000
    );

    if (differenceInSeconds < 60) {
      return "Just now";
    }

    const differenceInMinutes = Math.floor(
      differenceInSeconds / 60
    );

    if (differenceInMinutes < 60) {
      return `${differenceInMinutes} min ago`;
    }

    const differenceInHours = Math.floor(
      differenceInMinutes / 60
    );

    if (differenceInHours < 24) {
      return `${differenceInHours} hr ago`;
    }

    const differenceInDays = Math.floor(
      differenceInHours / 24
    );

    if (differenceInDays === 1) {
      return "Yesterday";
    }

    return `${differenceInDays} days ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-500">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">

        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Dashboard
          </h1>

          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Welcome back! Here's your project overview.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm sm:text-base break-words">
            {error}
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-6 sm:mb-8">

          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm min-w-0">
            <p className="text-gray-500 text-xs sm:text-sm">
              Total Projects
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-2">
              {totalProjects}
            </h2>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm min-w-0">
            <p className="text-gray-500 text-xs sm:text-sm">
              Total Tasks
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-2">
              {totalTasks}
            </h2>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm min-w-0">
            <p className="text-gray-500 text-xs sm:text-sm">
              Completed
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold text-green-600 mt-2">
              {completedTasks}
            </h2>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm min-w-0">
            <p className="text-gray-500 text-xs sm:text-sm">
              Overdue
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold text-red-500 mt-2">
              {overdueTasks}
            </h2>
          </div>

        </div>

        {/* Projects + Deadlines */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

          {/* Active Projects */}
          <div className="lg:col-span-2 bg-white rounded-xl p-4 sm:p-6 shadow-sm min-w-0">

            <div className="flex items-center justify-between gap-4 mb-5 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                Active Projects
              </h2>

              <Link
                to="/projects"
                className="text-blue-600 text-sm font-medium hover:underline whitespace-nowrap"
              >
                View All
              </Link>
            </div>

            {activeProjects.length === 0 ? (
              <p className="text-gray-500">
                No active projects.
              </p>
            ) : (
              <div className="space-y-5 sm:space-y-6">
                {activeProjects.map((project) => (
                  <div key={project._id}>

                    <div className="flex items-start justify-between gap-3 mb-2">
                      <span className="font-medium text-gray-700 break-words min-w-0">
                        {project.name}
                      </span>

                      <span className="text-sm text-gray-500 shrink-0">
                        {project.progress}%
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{
                          width: `${project.progress}%`,
                        }}
                      />
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm min-w-0">

            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-5 sm:mb-6">
              Upcoming Deadlines
            </h2>

            {upcomingDeadlines.length === 0 ? (
              <p className="text-gray-500">
                No upcoming deadlines.
              </p>
            ) : (
              <div className="space-y-4 sm:space-y-5">
                {upcomingDeadlines.map((task) => (
                  <Link
                    key={task._id}
                    to={`/tasks/${task._id}`}
                    className={`block border-l-4 pl-3 sm:pl-4 ${getDeadlineStyle(
                      task.deadline
                    )} hover:bg-gray-50 rounded-r-lg py-2 transition min-w-0`}
                  >
                    <h3 className="font-medium text-gray-800 break-words">
                      {task.title}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      {getDeadlineText(task.deadline)}
                    </p>
                  </Link>
                ))}
              </div>
            )}

          </div>

        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mt-4 sm:mt-6 min-w-0">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              Recent Activity
            </h2>

            <Link
              to="/notifications"
              className="text-blue-600 text-sm font-medium hover:underline self-start sm:self-auto"
            >
              Notifications
            </Link>
          </div>

          {activities.length === 0 ? (
            <p className="text-gray-500">
              No recent activity.
            </p>
          ) : (
            <div className="space-y-4">
              {activities.slice(0, 5).map((activity) => (
                <div
                  key={activity._id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b last:border-b-0 pb-4 last:pb-0 min-w-0"
                >
                  <div className="min-w-0">
                    <p className="text-gray-600 break-words">
                      <span className="font-medium text-gray-800">
                        {activity.user?.name || "Someone"}
                      </span>{" "}
                      {activity.action}
                    </p>

                    {activity.project?.name && (
                      <p className="text-xs text-gray-400 mt-1 break-words">
                        {activity.project.name}
                      </p>
                    )}
                  </div>

                  <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">
                    {getActivityTime(activity.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default Dashboard;

