
import { useEffect, useState } from "react";
import axios from "axios";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [markingReadId, setMarkingReadId] = useState(null);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications(response.data.notifications || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load notifications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    try {
      setMarkingReadId(notificationId);

      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/notifications/${notificationId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) =>
          notification._id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to mark notification as read."
      );
    } finally {
      setMarkingReadId(null);
    }
  };

  const getTimeAgo = (createdAt) => {
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
      return `${differenceInMinutes} ${
        differenceInMinutes === 1 ? "minute" : "minutes"
      } ago`;
    }

    const differenceInHours = Math.floor(
      differenceInMinutes / 60
    );

    if (differenceInHours < 24) {
      return `${differenceInHours} ${
        differenceInHours === 1 ? "hour" : "hours"
      } ago`;
    }

    const differenceInDays = Math.floor(
      differenceInHours / 24
    );

    if (differenceInDays === 1) {
      return "Yesterday";
    }

    return `${differenceInDays} days ago`;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Notifications
        </h1>

        <p className="text-gray-500 mt-1">
          Stay updated with your project activities
        </p>
      </div>

      {error && (
        <div className="max-w-3xl mb-6 bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {loading && (
        <div className="max-w-3xl">
          <p className="text-gray-500">
            Loading notifications...
          </p>
        </div>
      )}

      {!loading && !error && notifications.length === 0 && (
        <div className="max-w-3xl bg-white rounded-xl p-8 shadow-sm text-center">
          <p className="text-gray-500">
            No notifications yet.
          </p>
        </div>
      )}

      {!loading && notifications.length > 0 && (
        <div className="max-w-3xl space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`bg-white rounded-xl p-5 shadow-sm border ${
                notification.isRead
                  ? "border-gray-100"
                  : "border-blue-200"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-gray-800">
                      {notification.type === "task"
                        ? "Task Notification"
                        : notification.type === "project"
                        ? "Project Update"
                        : notification.type === "team"
                        ? "Team Update"
                        : "Notification"}
                    </h2>

                    {!notification.isRead && (
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                        New
                      </span>
                    )}
                  </div>

                  <p className="text-gray-500 text-sm mt-1">
                    {notification.message}
                  </p>

                  {!notification.isRead && (
                    <button
                      onClick={() =>
                        handleMarkAsRead(notification._id)
                      }
                      disabled={
                        markingReadId === notification._id
                      }
                      className="text-sm text-blue-600 font-medium mt-3 hover:underline disabled:opacity-60"
                    >
                      {markingReadId === notification._id
                        ? "Marking..."
                        : "Mark as read"}
                    </button>
                  )}
                </div>

                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {getTimeAgo(notification.createdAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications;

