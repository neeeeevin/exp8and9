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

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/users/register", form);
      setMessage(res.data.msg);

      // ✅ If registration successful, redirect to login page after 2 seconds
      if (res.status === 201) {
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      setMessage(err.response?.data?.msg || "Something went wrong");
    }
  };

  return (
    <div className="card p-4 shadow">
      <h4 className="mb-3 text-center">Register</h4>
      {message && <p className="text-danger text-center">{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          name="full_name"
          className="form-control mb-2"
          placeholder="Full Name"
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          className="form-control mb-2"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          name="username"
          className="form-control mb-2"
          placeholder="Username"
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          className="form-control mb-2"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <input
          name="confirmPassword"
          type="password"
          className="form-control mb-3"
          placeholder="Confirm Password"
          onChange={handleChange}
          required
        />
        <button className="btn btn-primary w-100 mb-2">Register</button>

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
