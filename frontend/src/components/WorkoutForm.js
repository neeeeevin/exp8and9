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

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/workouts/add", {
        ...form,
        userId,
      });
      onWorkoutAdded();
      setForm({ workoutName: "", type: "Cardio", duration: "", date: "", notes: "" });
    } catch (err) {
      alert("Error adding workout");
    }
  };

  return (
    <form className="mb-4" onSubmit={handleSubmit}>
      <h5 className="text-info mb-3">Add New Workout</h5>
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
        className="form-control mb-2"
        name="notes"
        placeholder="Notes (optional)"
        value={form.notes}
        onChange={handleChange}
      ></textarea>
      <button className="btn btn-success w-100">Add Workout</button>
    </form>
  );
}

export default WorkoutForm;
