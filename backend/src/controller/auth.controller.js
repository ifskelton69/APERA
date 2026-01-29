import User from '../models/Users.js';
import jwt from 'jsonwebtoken';
import { upsertStreamUser } from '../lib/stream.js';
import cloudinary from '../lib/cloudinary.js';

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

    // Use ui-avatars.com instead - it's more reliable
    const randomAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random&size=200`;

    const newUser = await User.create({
      email,
      fullName,
      password,
      profilePic: randomAvatar,
      location: "",
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
  const { location, fullName, bio, profilePic } = req.body;
  
  try {
    if (!fullName || !fullName.trim()) {
      return res.status(400).json({
        message: "Full name is required"
      });
    }

    const updateData = {
      fullName: fullName.trim(),
      bio: bio || "",
      location: location || "",
      isOnBoarded: true,
    };

    // Upload to Cloudinary if profilePic is provided and it's base64
    if (profilePic && profilePic.trim() && profilePic.startsWith('data:image')) {
      try {
        
        // Use unsigned upload with upload_preset
        const uploadResponse = await cloudinary.uploader.unsigned_upload(
          profilePic,
          'profile_pictures', // This is your upload preset name
          {
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME
          }
        );
        
        updateData.profilePic = uploadResponse.secure_url;
      } catch (uploadError) {
        return res.status(500).json({ message: "Error uploading image" });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      updateData,
      { new: true, runValidators: false }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    try {
      await upsertStreamUser({ 
        id: updatedUser._id.toString(), 
        name: updatedUser.fullName, 
        image: updatedUser.profilePic || "" 
      });
      console.log(`Stream user updated for ${updatedUser.fullName}`);
    } catch (error) {
      console.error("Error syncing with Stream:", error);
    }

    res.status(200).json({ success: true, user: updatedUser });
  }
  catch (error) {
    console.log("Error in onboard controller", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}