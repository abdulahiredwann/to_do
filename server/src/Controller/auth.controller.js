// here login and register

const router = require("express").Router();
const { User, validate, validateLogin } = require("../model/users");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already registered");

    user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();
    const token = user.generateAuthToken();
    res
      .status(201)
      .send({ data: token, message: "User registered successfully" });
  } catch (error) {
    res.status(500).send("An error occurred during registration");
  }
};

const login = async (req, res) => {
  try {
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Invalid email or password");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(400).send("Invalid email or password");

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
    res.status(500).send("An error occurred during login");
  }
};

// Define routes
router.post("/register", register);
router.post("/login", login);

module.exports = {
  router,
  register,
  login,
};
