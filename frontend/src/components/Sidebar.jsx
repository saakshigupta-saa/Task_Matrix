import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  Bell,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const navigate = useNavigate();

  const fetchUnreadNotifications = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setUnreadCount(0);
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/notifications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const notifications =
        response.data.notifications || [];

      const unreadNotifications = notifications.filter(
        (notification) => !notification.isRead
      );

      setUnreadCount(unreadNotifications.length);
    } catch (error) {
      console.error(
        "Failed to fetch notification count:",
        error
      );
    }
  };

  useEffect(() => {
    fetchUnreadNotifications();

    const interval = setInterval(
      fetchUnreadNotifications,
      30000
    );

    return () => clearInterval(interval);
  }, []);

  const navigation = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Projects",
      path: "/projects",
      icon: FolderKanban,
    },
    {
      name: "Tasks",
      path: "/tasks",
      icon: CheckSquare,
    },
    {
      name: "Team",
      path: "/team",
      icon: Users,
    },
    {
      name: "Notifications",
      path: "/notifications",
      icon: Bell,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUnreadCount(0);
    setIsOpen(false);

    navigate("/login");
  };

  return (
    <>
      {/* Mobile / Tablet Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-3 rounded-lg shadow-md text-gray-700"
      >
        <Menu size={22} />
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 min-h-screen bg-white border-r flex-col">
        <div className="px-6 py-6 border-b">
          <h1 className="text-2xl font-bold text-blue-600">
            TaskMatrix
          </h1>

          <p className="text-xs text-gray-500 mt-1">
            Project Management
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                to={item.path}
                className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition"
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} />
                  {item.name}
                </div>

                {item.name === "Notifications" &&
                  unreadCount > 0 && (
                    <span className="min-w-5 h-5 px-1.5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-semibold">
                      {unreadCount > 99
                        ? "99+"
                        : unreadCount}
                    </span>
                  )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Logout */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-gray-600 hover:bg-gray-100 hover:text-red-600 transition"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile / Tablet Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* Mobile / Tablet Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 w-72 h-full bg-white shadow-xl flex flex-col transform transition-transform duration-300 md:hidden ${
          isOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {/* Mobile Header */}
        <div className="px-6 py-5 border-b flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">
              TaskMatrix
            </h1>

            <p className="text-xs text-gray-500 mt-1">
              Project Management
            </p>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <X size={22} />
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition"
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} />
                  {item.name}
                </div>

                {item.name === "Notifications" &&
                  unreadCount > 0 && (
                    <span className="min-w-5 h-5 px-1.5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-semibold">
                      {unreadCount > 99
                        ? "99+"
                        : unreadCount}
                    </span>
                  )}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Logout */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-gray-600 hover:bg-gray-100 hover:text-red-600 transition"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;

