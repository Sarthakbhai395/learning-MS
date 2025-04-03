const express = require("express")
const { isAuthenticated } = require("../middleware/authMiddleware")
const { createLecture, getAllLecture, editLecture, deleteLecture, getLectureById } = require("../controller/lectureController")
const router = express.Router()

router.post("/:courseId/lecture",isAuthenticated,createLecture)
router.get("/:courseId/lecture",isAuthenticated,getAllLecture)
router.post("/:couseId/lecture/:lectureId",isAuthenticated,editLecture)
router.delete("/:courseId/lecture/:lectureId",isAuthenticated,deleteLecture)
router.get("/lecture/:lectureId",isAuthenticated,getLectureById)

module.exports = router