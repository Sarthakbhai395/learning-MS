const jwt = require("jsonwebtoken")

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token)
      return res
        .status(401)
        .json({ success: false, errorMessage: "Unauthorized" });

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log(verified)
    if (!verified)
      return res
        .status(401)
        .json({ success: false, errorMessage: "Invalid token" });

    req.id = verified.id;
    next();
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, errorMessage: "Internal Server Error" });
  }
};

module.exports = { isAuthenticated }; // Ensure proper export
