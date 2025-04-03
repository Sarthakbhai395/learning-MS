const express = require('express');
const router = express.Router();

const { registerUser, loginUser,getUserProfile,logoutUser,updateProfile } = require('../controller/userController');
const {isAuthenticated} = require('../middleware/authMiddleware');
const { upload } = require('../utils/multer');

// User registration

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get("/profile",isAuthenticated,getUserProfile);
router.put("/profile/update",isAuthenticated,upload.single("profilePhoto"),updateProfile)



module.exports = router;