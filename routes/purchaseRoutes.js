const express = require("express")
const router = express.Router()

const { isAuthenticated } = require("../middleware/authMiddleware")
const { createPurchase, razorpayWebhook } = require("../controller/coursePurchaseController")


router.post("/checkout/create-checkout-session",isAuthenticated,createPurchase)
router.post("/webhook",express.raw({type:"application/json"}),razorpayWebhook)

// router.get("/course/:courseId/detail-with-status",)
// router.get("/",)


module.exports = router