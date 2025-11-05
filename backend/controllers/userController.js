import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const registerUser = async (req, res) => {
  const { full_name, email, username, password, confirmPassword } = req.body;
  try {
    if (!full_name || !email || !username || !password || !confirmPassword)
      return res.status(400).json({ msg: "All fields are required" });

    if (password !== confirmPassword)
      return res.status(400).json({ msg: "Passwords do not match" });

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser)
      return res.status(400).json({ msg: "Email or username already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ full_name, email, username, password: hashed });
    await newUser.save();
    res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const loginUser = async (req, res) => {
  const { emailOrUsername, password } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ msg: "Login successful", token });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
