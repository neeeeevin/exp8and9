import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ emailOrUsername: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/users/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setMessage(err.response.data.msg);
    }
  };

  return (
    <div className="card p-4 shadow">
      <h4>Login</h4>
      {message && <p className="text-danger">{message}</p>}
      <form onSubmit={handleSubmit}>
        <input name="emailOrUsername" className="form-control mb-2" placeholder="Username or Email" onChange={handleChange} />
        <input name="password" type="password" className="form-control mb-2" placeholder="Password" onChange={handleChange} />
        <button className="btn btn-success w-100">Login</button>
      </form>
    </div>
  );
}

export default Login;
