import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // ✅ Use environment variable for backend base URL
  const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // ✅ Client-side password validation
    if (form.password !== form.confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}/api/users/register`, form);

      if (res.status === 201 || res.data?.msg) {
        setMessage(res.data.msg || "Registration successful!");

        // ✅ Redirect to login after short delay
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setMessage("Unexpected response from the server. Try again.");
      }
    } catch (err) {
      console.error("Registration error:", err);

      if (err.response?.data?.msg) {
        setMessage(err.response.data.msg);
      } else if (err.message === "Network Error") {
        setMessage("Cannot connect to the server. Please check your backend.");
      } else {
        setMessage("Something went wrong during registration.");
      }
    }
  };

  return (
    <div className="card p-4 shadow" style={{ maxWidth: "420px", margin: "auto" }}>
      <h4 className="mb-3 text-center text-primary">Register</h4>

      {message && <p className="text-danger text-center">{message}</p>}

      <form onSubmit={handleSubmit}>
        <input
          name="full_name"
          className="form-control mb-2"
          placeholder="Full Name"
          value={form.full_name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          className="form-control mb-2"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="username"
          className="form-control mb-2"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          className="form-control mb-2"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <input
          name="confirmPassword"
          type="password"
          className="form-control mb-3"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        <button type="submit" className="btn btn-primary w-100 mb-2">
          Register
        </button>

        <p className="text-center mt-2">
          Already have an account?{" "}
          <Link to="/login" className="text-info">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
