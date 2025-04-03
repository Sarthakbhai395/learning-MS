const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [3, 'Name must be at least 3 characters long'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [1, 'Password must be at least 6 characters long'],
      select: false, // Ensures password is not returned in queries by default
    },
    role: {
      type: String,
      enum: ['user', 'instructor'],
      default: 'instructor',
    },
    enrolledCourses: [
      {
        course: {
          type: Object, // Changed from mongoose.Schema.Types.ObjectId to Object
          required: true
        },
        enrolledOn: {
          type: Date,
          default: Date.now
        },
        progress: {
          type: Number,
          default: 0
        },
        completed: {
          type: Boolean,
          default: false
        }
      }
    ],
    photoUrl: {
      type: String,
      default: ''
    }
  }
);

// Export the User model
const User = mongoose.model('User', userSchema);

module.exports = User;