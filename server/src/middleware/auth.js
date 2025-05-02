const jwt = require("jsonwebtoken");
const { User } = require("../model/users");

const auth = async (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies.token;
    console.log(token);

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user and attach to request
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Please authenticate" });
  }
};

module.exports = auth;
