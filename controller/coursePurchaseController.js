const CoursePurchase = require("../model/coursePurchase");  // Correct model name
const Course = require("../model/courseModel");
const Lecture = require("../model/lectureModel");
const User = require("../model/userModel")
const Razorpay = require('razorpay');
const crypto = require("crypto")

var instance = new Razorpay({
  key_id: process.env.keyId,  // Make sure these environment variables are set correctly
  key_secret: process.env.Secertkey,
});

exports.createPurchase = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.body;

    console.log("User ID:", userId, "Course ID:", courseId);

    // 1. Course Existence Check
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found!" });

    const amount = course.coursePrice * 100; // Razorpay expects amount in paisa (INR)

    console.log("Course price in paisa:", amount);

    // 2. Create Razorpay Order
    const options = {
      amount: amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await instance.orders.create(options);
    console.log("Razorpay Order Created Successfully:", order);

    if (!order.id) {
      return res.status(500).json({ message: "Failed to create order on Razorpay" });
    }

    // 3. Save the Purchase Record with Pending Status
    const newPurchase = new CoursePurchase({
      courseId,
      userId,
      amount: amount / 100, // Storing amount in rupees
      paymentId: order.id, // Razorpay Order ID
      status: "pending", // Setting status as pending initially
    });

    await newPurchase.save()
      .then(() => console.log("Order saved to DB successfully with status 'pending'"))
      .catch((err) => {
        console.error("Error saving to DB:", err);
        return res.status(500).json({ message: "Failed to save order in DB" });
      });

    // 4. Response with Order Details
    return res.status(200).json({
      success: true,
      orderId: order.id,
      order
    });

  } catch (error) {
    console.log("Error creating Razorpay order:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



exports.razorpayWebhook = async (req, res) => {
  try {
    console.log("Webhook received:", req.body);

    const payloadString = JSON.stringify(req.body);
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(payloadString)
      .digest("hex");

    const receivedSignature = req.headers["x-razorpay-signature"];

    if (generatedSignature !== receivedSignature) {
      return res.status(400).send("Invalid signature");
    }

    const event = JSON.parse(payloadString);
    console.log("Received Event Type:", event.event);

    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      console.log("Payment Data:", payment);

      // Pehle se existing "pending" purchase dhundo
      const purchase = await CoursePurchase.findOne({
        paymentId: payment.order_id || payment.id, // Payment ID match karo
        status: "pending", // Sirf pending status wale record ko update karo
      }).populate("courseId");

      if (!purchase) {
        console.log("Pending purchase not found for paymentId:", payment.order_id || payment.id);
        return res.status(404).json({ message: "Purchase not found or already completed" });
      }

      console.log("Updating purchase status to completed...");
      purchase.status = "completed";
      purchase.amount = payment.amount / 100;

      await purchase.save();
      console.log("Purchase updated successfully");

      // Make lectures visible
      if (purchase.courseId?.lectures?.length > 0) {
        console.log("Updating lectures visibility...");
        await Lecture.updateMany(
          { _id: { $in: purchase.courseId.lectures } },
          { $set: { isPreviewFree: true } }
        );
      }

      // Enroll user in course
      if (purchase.userId && purchase.courseId?._id) {
        console.log("Enrolling user in course...");
        await User.findByIdAndUpdate(
          purchase.userId,
          { $addToSet: { enrolledCourses: purchase.courseId._id } },
          { new: true }
        );

        await Course.findByIdAndUpdate(
          purchase.courseId._id,
          { $addToSet: { enrolledStudents: purchase.userId } },
          { new: true }
        );
      }
    }

    res.status(200).send();
  } catch (error) {
    console.error("Webhook error:", error.message);
    return res.status(400).send(`Webhook error: ${error.message}`);
  }
};



exports.getCourseCourseWithDetails = async (req, res) => {
  try {
    const {courseId} = req.params
    const userId =req.id;

    const course = await Course.findById(courseId)
     .populate({path: 'lectures'})
     .populate({path: 'creator'})

      const purchased = await CoursePurchase.findOne({userId,courseId})

     if (!course) {
       return res.status(404).json({ message: "Course not found" })
     }


     return res.status(200).json({
      course,
      purchased: purchased ? true : false
     })

  } catch (error) {
    console.log("error is error",error.message)
    return res.status(500).json({ message: "Failed to get course with details" })
  }
} 