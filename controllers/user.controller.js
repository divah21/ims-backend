import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {JWT_SECRET_KEY} from "../config/env.js";

const jwt_secret = JWT_SECRET_KEY || "your_secret_key";

/**
 * Register a new user
 */
export const registerUser = async (req, res) => {
  const { email, password, fullName, role, picture } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.query().findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    // Create a new user
    const newUser = await User.query().insert({
      email,
      password, // The password will be hashed before saving by the $beforeInsert method in User model
      fullName,
      role,
      picture,
    });

    res.status(201).json({ message: "User registered successfully!", user: newUser });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Login user and return a JWT token
 */
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.query().findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    // Create JWT token
    const token = jwt.sign(
        { userId: user.id, email: user.email },
        jwt_secret,
        { expiresIn: "1h" }
    );

    // Respond with token and user data
    res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get all users
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.query();
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err.message);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get a user by ID
 */
export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.query().findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user:", err.message);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Update a user's details
 */
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { fullName, role, picture } = req.body;

  try {
    const updatedUser = await User.query().patchAndFetchById(id, {
      fullName,
      role,
      picture,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json({ message: "User updated successfully!", user: updatedUser });
  } catch (err) {
    console.error("Error updating user:", err.message);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Delete a user by ID
 */
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRows = await User.query().delete().where({ id });

    if (!deletedRows) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json({ message: "User deleted successfully!" });
  } catch (err) {
    console.error("Error deleting user:", err.message);
    res.status(500).json({ error: err.message });
  }
};
