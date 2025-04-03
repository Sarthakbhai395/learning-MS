const express = require("express")
const app = express()
const connectDB = require("./utils/db")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const user = require("./routes/authRoute")
const course = require("./routes/courseRoutes")
const lecture = require("./routes/lectureRoutes")
const mediaRoute = require("./routes/mediaRoute")
const purchaseRoute = require("./routes/purchaseRoutes")
require("dotenv").config()


app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(cors({
    origin: "http://localhost:5173", // Frontend origin
    methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
    credentials: true, // Allow credentials (cookies, auth headers)
  }))

app.use(cookieParser())
app.use("/api/v1/user",user)
app.use("/api/v1/course",course)
app.use("/api/v1/lecture",lecture)
app.use("/api/v1/media",mediaRoute)
app.use("/api/v1/purchase",purchaseRoute)

// Connect to MongoDB Database
connectDB()

app.listen(process.env.PORT,()=>{
    console.log("Server is running on port 3000")
})