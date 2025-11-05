import express from "express";
import { addWorkout, getWorkouts, deleteWorkout, updateWorkout } from "../controllers/workoutController.js";

const router = express.Router();

router.post("/add", addWorkout);
router.get("/", getWorkouts);
router.delete("/:id", deleteWorkout);
router.put("/:id", updateWorkout);

export default router;
