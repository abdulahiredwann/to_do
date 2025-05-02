// auth toute

const router = require("express").Router();
const {
  register,
  login,
  validateMe,
} = require("../Controller/auth.controller");

router.post("/register", register);
router.post("/login", login);
router.get("/validate", validateMe);

module.exports = router;
