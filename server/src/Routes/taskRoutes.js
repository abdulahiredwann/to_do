const express = require("express");
const router = express.Router();
const taskController = require("../Controller/task.controller");
const auth = require("../middleware/auth");

// All routes are protected and require authentication
router.use(auth);

// Task routes
router.post("/", taskController.createTask);
router.get("/", taskController.getUserTasks);
router.get("/:id", taskController.getTask);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

module.exports = router;
