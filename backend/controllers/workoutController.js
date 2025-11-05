import Workout from "../models/Workout.js";

export const addWorkout = async (req, res) => {
  try {
    const { userId, workoutName, duration, date, notes, type } = req.body;
    const workout = new Workout({ userId, workoutName, duration, date, notes, type });
    await workout.save();
    res.status(201).json({ msg: "Workout added successfully", workout });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const getWorkouts = async (req, res) => {
  try {
    const { userId } = req.query;
    const workouts = await Workout.find({ userId }).sort({ date: -1 });
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const deleteWorkout = async (req, res) => {
  try {
    await Workout.findByIdAndDelete(req.params.id);
    res.json({ msg: "Workout deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const updateWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Workout.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ msg: "Workout updated successfully", updated });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
