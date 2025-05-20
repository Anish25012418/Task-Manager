import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({id: userId}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES});
}

// @desc Register a new user
// @route method=POST url=/api/auth/register
// @access Public
const registerUser = async (req, res) => {
  try {
    const {name, email, password, profileImageUrl, adminInviteToken} = req.body;

    const userExists = await User.findOne({email})
    if (userExists) {
      return res.status(400).json({error: "User with this email already exists"})
    }

    let role = "member";
    if (adminInviteToken && adminInviteToken === process.env.ADMIN_INVITE_TOKEN) {
      role = "admin";
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profileImageUrl,
      role
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImageUrl: user.profileImageUrl,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({message: "Server error", error: error.message});
  }
}

// @desc Login user
// @route method=POST url=/api/auth/login
// @access Public
const loginUser = async (req, res) => {
  try {
    const {email, password} = req.body;

    const user = await User.findOne({email});
    if (!user) {
      return res.status(401).json({error: "Invalid email or password"})
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({error: "Invalid email or password"})
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImageUrl: user.profileImageUrl,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({message: "Server error", error: error.message});
  }
}

// @desc Get user profile
// @route method=GET url=/api/auth/profile
// @access Private (Requires JWT)
const getUserProfile = async (req, res) => {
  try {
    // const user = await User.findById(req.user.id).select("-password");
    if (!req.user) {
      return res.status(401).json({error: "User not found"})
    }
    res.json(req.user)
  } catch (error) {
    res.status(500).json({message: "Server error", error: error.message});
  }
}

// @desc Update user profile
// @route method=PUT url=/api/auth/profile
// @access Private (Requires JWT)
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(401).json({error: "User not found"})
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save()

    res.status(201).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      token: generateToken(updatedUser._id)
    });

  } catch (error) {
    res.status(500).json({message: "Server error", error: error.message});
  }
}

// @desc Delete user profile
// @route method=DELETE url=/api/auth/profile
// @access Private (Requires JWT)
const deleteUserProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({error: "User not found"})
    }
    await User.findByIdAndDelete(req.user._id);
    res.status(200).json({message: "User deleted successfully."});
  } catch (error) {
    res.status(500).json({message: "Server error", error: error.message});
  }
}

const uploadUserProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({error: "No file uploaded"});
    }
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.status(200).json({imageUrl})
  }catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Something went wrong during upload" });
  }
}

export {registerUser, loginUser, getUserProfile, updateUserProfile, deleteUserProfile, uploadUserProfileImage}