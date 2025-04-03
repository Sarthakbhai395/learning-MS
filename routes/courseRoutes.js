const express = require('express');
const router = express.Router();


const {isAuthenticated} = require('../middleware/authMiddleware');
const { createCourse, getAllAdminCourse, editCourse, getCourseById, togglePublishCourse, deleteCourse,publishedCourse } = require('../controller/courseController');
const { upload } = require('../utils/multer');

// User registration

router.post('/', isAuthenticated,createCourse);
router.get('/', isAuthenticated,getAllAdminCourse);
router.get('/published-course', isAuthenticated,publishedCourse);
router.put('/:courseId', isAuthenticated,upload.single("courseThumbnail"),editCourse);
router.get('/:courseId', isAuthenticated,getCourseById);
router.patch('/:courseId/', isAuthenticated,togglePublishCourse);
router.delete('/:courseId/', isAuthenticated,deleteCourse);






module.exports = router;