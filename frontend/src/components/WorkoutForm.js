import React, { useState } from "react";
import axios from "axios";

function WorkoutForm({ userId, onWorkoutAdded }) {
  const [form, setForm] = useState({
    workoutName: "",
    type: "Cardio",
    duration: "",
    date: "",
    notes: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Use .env variable for backend URL (with fallback)
  const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    // ✅ Simple form validation
    if (!form.workoutName || !form.duration || !form.date) {
      setMessage("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      await axios.post(`${API_BASE}/api/workouts/add`, { ...form, userId });
      onWorkoutAdded();
      setMessage("✅ Workout added successfully!");
      setForm({
        workoutName: "",
        type: "Cardio",
        duration: "",
        date: "",
        notes: "",
      });
    } catch (err) {
      console.error("Error adding workout:", err);
      if (err.response?.data?.msg) {
        setMessage(`⚠️ ${err.response.data.msg}`);
      } else if (err.message === "Network Error") {
        setMessage("Cannot connect to the server. Please check your backend.");
      } else {
        setMessage("Error adding workout. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="mb-4 p-3 border rounded shadow-sm bg-light" onSubmit={handleSubmit}>
      <h5 className="text-info mb-3 text-center">Add New Workout</h5>

      {message && (
        <p
          className={`text-center ${
            message.startsWith("✅") ? "text-success" : "text-danger"
          }`}
        >
          {message}
        </p>
      )}

      <input
        className="form-control mb-2"
        name="workoutName"
        placeholder="Workout Name"
        value={form.workoutName}
        onChange={handleChange}
        required
      />

      <select
        className="form-select mb-2"
        name="type"
        value={form.type}
        onChange={handleChange}
      >
        <option>Cardio</option>
        <option>Strength</option>
        <option>Yoga</option>
        <option>HIIT</option>
        <option>Stretching</option>
      </select>

      <input
        className="form-control mb-2"
        name="duration"
        type="number"
        placeholder="Duration (minutes)"
        value={form.duration}
        onChange={handleChange}
        required
      />

      <input
        className="form-control mb-2"
        name="date"
        type="date"
        value={form.date}
        onChange={handleChange}
        required
      />

      <textarea
        className="form-control mb-3"
        name="notes"
        placeholder="Notes (optional)"
        value={form.notes}
        onChange={handleChange}
      ></textarea>

      <button
        className="btn btn-success w-100"
        type="submit"
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Workout"}
      </button>
    </form>
  );
}

export default WorkoutForm;
