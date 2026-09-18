import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
const navigate = useNavigate();

const [formData, setFormData] = useState({
email: "",
password: "",
});

const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

const handleChange = (event) => {
setFormData({
...formData,
[event.target.name]: event.target.value,
});
};

const handleSubmit = async (event) => {
event.preventDefault();

setError("");
setLoading(true);

try {
  const response = await axios.post(
    "http://localhost:5000/api/auth/login",
    formData
  );

  localStorage.setItem("token", response.data.token);
  localStorage.setItem("user", JSON.stringify(response.data.user));

  navigate("/dashboard");
} catch (error) {
  setError(
    error.response?.data?.message ||
      "Login failed. Please check your credentials."
  );
} finally {
  setLoading(false);
}

};

return ( <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4"> <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-gray-800">
        TaskMatrix
      </h1>

      <p className="text-gray-500 mt-2">
        Sign in to manage your projects
      </p>
    </div>

    {error && (
      <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
        {error}
      </div>
    )}

    <form onSubmit={handleSubmit} className="space-y-5">

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>

        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Signing In..." : "Login"}
      </button>

    </form>

    <p className="text-center text-sm text-gray-500 mt-6">
      Don't have an account?{" "}
      <Link
        to="/register"
        className="text-blue-600 font-medium hover:underline"
      >
        Register
      </Link>
    </p>

  </div>
</div>

);
}

export default Login;
