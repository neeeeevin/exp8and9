import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ emailOrUsername: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // ✅ Use .env variable for backend URL (fallback to localhost if not set)
  const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear old message

    try {
      const res = await axios.post(`${API_BASE}/api/users/login`, form);

      // ✅ Make sure token exists before using it
      if (res.data && res.data.token) {
        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
      } else {
        setMessage("Unexpected server response. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);

      // ✅ Handle all possible error cases safely
      if (err.response?.data?.msg) {
        setMessage(err.response.data.msg);
      } else if (err.message === "Network Error") {
        setMessage("Cannot connect to the server. Please check your backend.");
      } else {
        setMessage("Login failed. Please check credentials and try again.");
      }
    }
  };

  return (
    <div className="card p-4 shadow" style={{ maxWidth: "400px", margin: "auto" }}>
      <h4 className="text-center mb-3 text-primary">Login</h4>
      {message && <p className="text-danger text-center">{message}</p>}

      <form onSubmit={handleSubmit}>
        <input
          name="emailOrUsername"
          className="form-control mb-2"
          placeholder="Username or Email"
          value={form.emailOrUsername}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn btn-success w-100">
          Login
        </button>
      </form>

      <p className="text-center mt-3">
        Don’t have an account?{" "}
        <a href="/" className="text-info">
          Register here
        </a>
      </p>
    </div>
  );
}

export default Login;
