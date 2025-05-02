// here login and register

const { User, validate, validateLogin } = require("../model/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const register = async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({
        message: error.details[0].message,
        status: "error",
      });

    let user = await User.findOne({ email: req.body.email });
    if (user)
      return res.status(400).send({
        message: "User already registered",
        status: "error",
      });

    user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();
    const token = user.generateAuthToken();
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      sameSite: "strict",
    });
    res.status(201).send({
      data: token,
      message: "User registered successfully",
      status: "success",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "An error occurred during registration",
      status: "error",
    });
  }
};

const login = async (req, res) => {
  try {
    const { error } = validateLogin(req.body);
    if (error)
      return res.status(400).send({
        message: error.details[0].message,
        status: "error",
      });

    let user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(400).send({
        message: "Invalid email or password",
        status: "error",
      });

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(400).send({
        message: "Invalid email or password",
        status: "error",
      });

    const token = user.generateAuthToken();
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      sameSite: "strict",
    });

    res.status(200).send({
      data: token,
      message: "Logged in successfully",
      status: "success",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "An error occurred during login",
      status: "error",
    });
  }
};

const validateMe = async (req, res) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).send({ message: "Unauthorized", status: "error" });
  console.log(token);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);
    if (!user)
      return res.status(401).send({ message: "Unauthorized", status: "error" });

    res.status(200).send({
      data: user,
      message: "User validated successfully",
      status: "success",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "An error occurred during validation",
      status: "error",
    });
  }
};
module.exports = {
  register,
  login,
  validateMe,
};
