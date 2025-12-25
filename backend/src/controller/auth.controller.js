import User from '../models/Users.js';
import jwt from 'jsonwebtoken';
import { upsertStreamUser } from '../lib/stream.js';

export async function signUp(req, res) {
  const { email, password, fullName } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  try {
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists, please use a different one" });
    }

    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    const newUser = await User.create({
      email,
      fullName,
      password,
      profilePic: randomAvatar,
      location: "Not specified",
      learningLanguage: "English",
      nativeLand: "Not specified"
    });

    try {
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullName,
        image: newUser.profilePic || "",
      });
      console.log(`Stream user created for ${newUser.fullName}`);
    } catch (error) {
      console.error("Error syncing with Stream:", error);
    }

    // Fixed: Use consistent JWT_SECRET (not JWT_SECRET_KEY)
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    console.log("Error in signup controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ success: true, user: user });
  } catch (error) {
    console.log("Error in login controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export function logout(req, res) {
  res.clearCookie("jwt");
  res.status(200).json({ message: "Logged out successfully" });
}

export async function onboard(req, res) {
  const userId = req.user._id;
  const { location, fullName, bio } = req.body;
  try {
    if (!location || !fullName || !bio) {
      return res.status(400).json({
        message: "All fields are required", missingfields: [
          !location && 'city,country',
          !fullName && 'fullName',
          !bio && 'bio'
        ].filter(Boolean)
      });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, {
      ...req.body,
      isOnBoarded: true,
    }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    try {
      await upsertStreamUser({ id: updatedUser._id.toString(), name: updatedUser.fullName, image: updatedUser.profilePic || "" });
      console.log(`Stream user updated for ${updatedUser.fullName}`);
    } catch (error) {
      console.error("Error syncing with Stream:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    res.status(200).json({ success: true, user: updatedUser });
  }
  catch (error) {
    console.log("Error in onboard controller", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}