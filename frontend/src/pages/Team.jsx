import { useEffect, useState } from "react";
import axios from "axios";

function Team() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTeamMembers = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/projects",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const projects = response.data.projects || [];

      const memberMap = new Map();

      projects.forEach((project) => {
        if (project.owner) {
          memberMap.set(project.owner._id, {
            id: project.owner._id,
            name: project.owner.name,
            role: "Project Manager",
          });
        }

        if (project.members) {
          project.members.forEach((member) => {
            if (!memberMap.has(member._id)) {
              memberMap.set(member._id, {
                id: member._id,
                name: member.name,
                role: "Team Member",
              });
            }
          });
        }
      });

      setMembers(Array.from(memberMap.values()));
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to load team members."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const getInitials = (name) => {
    if (!name) return "NA";

    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Team
        </h1>

        <p className="text-gray-500 mt-1">
          Manage your project team members
        </p>
      </div>

      {loading && (
        <p className="text-gray-500">
          Loading team members...
        </p>
      )}

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {!loading && !error && members.length === 0 && (
        <div className="bg-white rounded-xl p-8 shadow-sm text-center">
          <p className="text-gray-500">
            No team members found.
          </p>
        </div>
      )}

      {!loading && !error && members.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {members.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-xl p-6 shadow-sm text-center"
            >
              <div className="w-16 h-16 mx-auto bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-semibold">
                {getInitials(member.name)}
              </div>

              <h2 className="text-lg font-semibold text-gray-800 mt-4">
                {member.name}
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {member.role}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Team;

