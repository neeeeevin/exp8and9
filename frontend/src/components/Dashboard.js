import React, { useEffect, useState } from "react";
import axios from "axios";
import WorkoutForm from "./WorkoutForm";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({});
  const userToken = localStorage.getItem("token");
  const [userId, setUserId] = useState(null);
  const [quote, setQuote] = useState("");

  useEffect(() => {
    if (!userToken) navigate("/login");
    else {
      const base64Url = userToken.split(".")[1];
      const decoded = JSON.parse(atob(base64Url));
      setUserId(decoded.id);
    }
  }, [userToken, navigate]);

  const quotes = [
    "Push harder than yesterday if you want a different tomorrow!",
    "No pain, no gain!",
    "Strive for progress, not perfection!",
    "Sweat is fat crying!",
    "The body achieves what the mind believes!"
  ];

  const fetchWorkouts = async () => {
    const res = await axios.get("http://localhost:5000/api/workouts", { params: { userId } });
    setWorkouts(res.data);
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  };

  useEffect(() => { if (userId) fetchWorkouts(); }, [userId]);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this workout?")) {
      await axios.delete(`http://localhost:5000/api/workouts/${id}`);
      fetchWorkouts();
    }
  };

  const handleEdit = (workout) => {
    setEditing(workout._id);
    setEditForm({ ...workout });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    await axios.put(`http://localhost:5000/api/workouts/${editing}`, editForm);
    setEditing(null);
    fetchWorkouts();
  };

  const totalWorkouts = workouts.length;
  const totalMinutes = workouts.reduce((sum, w) => sum + w.duration, 0);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header mb-3">
        <h3>🏋️ Gym Dashboard</h3>
        <button className="btn btn-danger btn-sm" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="quote-box">“{quote}”</div>

      <WorkoutForm userId={userId} onWorkoutAdded={fetchWorkouts} />

      <div className="summary-box text-center">
        Weekly Summary: <strong>{totalWorkouts}</strong> Workouts |{" "}
        <strong>{totalMinutes}</strong> Minutes
      </div>

      <h5 className="text-primary mb-3">Your Workouts</h5>

      {workouts.length === 0 ? (
        <p className="text-muted">No workouts yet. Add one above!</p>
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
                    <button className="btn btn-success btn-sm me-2">Save</button>
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
                    <span className={`badge badge-${w.type}`}>{w.type}</span>
                    <div className="workout-date">
                      {new Date(w.date).toLocaleDateString()}
                    </div>
                    {w.notes && <p className="text-muted mb-0">{w.notes}</p>}
                  </div>
                  <div>
                    <button
                      className="btn-edit me-2"
                      onClick={() => handleEdit(w)}
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-delete"
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
