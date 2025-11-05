import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  workoutName: { type: String, required: true },
  type: { type: String, enum: ["Cardio", "Strength", "Yoga", "HIIT", "Stretching"], required: true },
  duration: { type: Number, required: true },
  date: { type: Date, required: true },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Workout", workoutSchema);
