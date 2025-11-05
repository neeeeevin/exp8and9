import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import WorkoutForm from "./WorkoutForm";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

// ✅ Move motivational quotes OUTSIDE the component to prevent ESLint warnings
const motivationalQuotes = [
  "Push harder than yesterday if you want a different tomorrow!",
  "No pain, no gain!",
  "Strive for progress, not perfection!",
  "Sweat is fat crying!",
  "The body achieves what the mind believes!",
];

function Dashboard() {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [userId, setUserId] = useState(null);
  const [quote, setQuote] = useState("");
  const userToken = localStorage.getItem("token");

  // ✅ Redirect if no token
  useEffect(() => {
    if (!userToken) {
      navigate("/login");
      return;
    }
    try {
      const base64Url = userToken.split(".")[1];
      const decoded = JSON.parse(atob(base64Url));
      setUserId(decoded.id);
    } catch (err) {
      console.error("Invalid token:", err);
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [userToken, navigate]);

  // ✅ Use environment variable for backend URL
  const API_BASE =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

  // ✅ Fetch workouts with useCallback (warning-free now)
  const fetchWorkouts = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/workouts`, {
        params: { userId },
      });
      setWorkouts(res.data);
      setQuote(
        motivationalQuotes[
          Math.floor(Math.random() * motivationalQuotes.length)
        ]
      );
    } catch (err) {
      console.error("Error fetching workouts:", err.message);
    }
  }, [API_BASE, userId]);

  // ✅ Run once when userId is set
  useEffect(() => {
    if (userId) fetchWorkouts();
  }, [userId, fetchWorkouts]);

  // ✅ Delete a workout
  const handleDelete = async (id) => {
    if (window.confirm("Delete this workout?")) {
      try {
        await axios.delete(`${API_BASE}/api/workouts/${id}`);
        fetchWorkouts();
      } catch (err) {
        console.error("Error deleting workout:", err.message);
      }
    }
  };

  // ✅ Edit workout
  const handleEdit = (workout) => {
    setEditing(workout._id);
    setEditForm({ ...workout });
  };

  // ✅ Save edited workout
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE}/api/workouts/${editing}`, editForm);
      setEditing(null);
      fetchWorkouts();
    } catch (err) {
      console.error("Error updating workout:", err.message);
    }
  };

  // ✅ Weekly summary
  const totalWorkouts = workouts.length;
  const totalMinutes = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header mb-3 d-flex justify-content-between align-items-center">
        <h3 className="m-0">🏋️ Gym Dashboard</h3>
        <button className="btn btn-danger btn-sm" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Quote Section */}
      <div className="quote-box text-center">“{quote}”</div>

      {/* Add Workout */}
      <WorkoutForm userId={userId} onWorkoutAdded={fetchWorkouts} />

      {/* Summary */}
      <div className="summary-box text-center mt-3 mb-3">
        Weekly Summary: <strong>{totalWorkouts}</strong> Workouts |{" "}
        <strong>{totalMinutes}</strong> Minutes
      </div>

      <h5 className="text-primary mb-3">Your Workouts</h5>

      {workouts.length === 0 ? (
        <p className="text-muted text-center">
          No workouts yet. Add one above!
        </p>
      ) : (
        <ul className="workout-list">
          {workouts.map((w) => (
            <li key={w._id} className="workout-item">
              {editing === w._id ? (
                <form onSubmit={handleEditSubmit} style={{ width: "100%" }}>
                  <input
                    className="form-control mb-2"
                    value={editForm.workoutName}
                    onChange={(e) =>
                      setEditForm({ ...editForm, workoutName: e.target.value })
                    }
                  />
                  <input
                    className="form-control mb-2"
                    type="number"
                    value={editForm.duration}
                    onChange={(e) =>
                      setEditForm({ ...editForm, duration: e.target.value })
                    }
                  />
                  <textarea
                    className="form-control mb-2"
                    value={editForm.notes}
                    onChange={(e) =>
                      setEditForm({ ...editForm, notes: e.target.value })
                    }
                  ></textarea>
                  <div className="text-end">
                    <button className="btn btn-success btn-sm me-2">
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setEditing(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="workout-info">
                    <strong>{w.workoutName}</strong> ({w.duration} mins)
                    <span className="badge bg-info ms-2">{w.type}</span>
                    <div className="workout-date">
                      {new Date(w.date).toLocaleDateString()}
                    </div>
                    {w.notes && <p className="text-muted mb-0">{w.notes}</p>}
                  </div>
                  <div>
                    <button
                      className="btn btn-outline-primary btn-sm me-2"
                      onClick={() => handleEdit(w)}
                    >
                      ✏️
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDelete(w._id)}
                    >
                      🗑
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;
