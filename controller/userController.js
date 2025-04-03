const User = require("../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { deleteMedia, uploadMedia } = require("../utils/cloudinary");

// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if required fields are provided
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Please provide all fields" });
    }

    // Validate role (if provided)
    if (role && !["user", "instructor", "admin"].includes(role)) {
      return res.status(400).json({ success: false, error: "Invalid role" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    console.log("Existing User:", existingUser);

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, error: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with role (default to 'user' if not provided)
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || "instructor", // Default to 'user' if role not provided
    });
    console.log("New User Created:", user);

    // Generate JWT token with role
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "3h",
    });

    // Send success response with user details and token
    res
      .status(201)
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      })
      .json({
        success: true,
        message: "User created successfully",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(400).json({
      success: false,
      error: "Failed to register user",
      details: error.message,
    });
  }
};

// Login a user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if required fields are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Please provide email and password" });
    }

    // Find user and include password
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    console.log("User Found:", user);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid email or password" });
    }

    // Generate JWT token with role
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "3h",
    });

    // Send success response with token and user details
    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      })
      .json({
        success: true,
        message: "User logged in successfully",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role, // Include role in response
        },
      });
  } catch (error) {
    console.error("Error in loginUser:", error);
    return res
      .status(500)
      .json({ success: false, error: "Server error", details: error.message });
  }
};

// Logout a user
exports.logoutUser = async (req, res) => {
  console.log("Logout Section");
  try {
    return res
      .status(200)
      .cookie("token", "", { maxAge: 0 }) // Clear token cookie
      .json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    console.error("Error in logoutUser:", error);
    return res
      .status(500)
      .json({
        success: false,
        error: "Server error",
        message: "Failed to logout user",
      });
  }
};

// Get a user profile
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.id; // Assumes req.id is set by authentication middleware
    console.log("User ID:", userId);

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role, // Include role in profile
        enrolledCourses: user.enrolledCourses,
        photoUrl: user.photoUrl,
      },
    });
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    return res
      .status(500)
      .json({
        success: false,
        error: "Server error",
        message: "Failed to fetch user",
      });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const id = req.id; // Assumes req.id is set by authentication middleware
    const { name } = req.body;
    const profilePhoto = req.file;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Delete old photo from Cloudinary if it exists
    if (user.photoUrl && profilePhoto) {
      const public_id = user.photoUrl.split("/").pop().split(".")[0];
      await deleteMedia(public_id);
    }

    // Upload new photo to Cloudinary if provided
    let photoUrl = user.photoUrl;
    if (profilePhoto) {
      const cloudResponse = await uploadMedia(profilePhoto.path);
      console.log("Cloudinary Response:", cloudResponse);
      photoUrl = cloudResponse.secure_url;
    }

    // Update user data
    const updatedData = { name: name || user.name, photoUrl };
    const updatedUser = await User.findByIdAndUpdate(id, updatedData, {
      new: true,
    }).select("-password");

    return res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role, // Include role in response
        photoUrl: updatedUser.photoUrl,
      },
    });
  } catch (error) {
    console.error("Error in updateProfile:", error);
    return res
      .status(500)
      .json({
        success: false,
        error: "Server error",
        message: "Failed to update user",
      });
  }
};

// Middleware to protect routes (optional, add this to your routes later)
const protect = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ success: false, error: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.id = decoded.id; // Set user ID
    req.role = decoded.role; // Set user role for further checks
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: "Invalid token" });
  }
};

// Export protect middleware (optional, use in routes)
exports.protect = protect;

module.exports = exports;