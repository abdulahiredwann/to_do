const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");

const taskSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ["In Progress", "Completed", "Cancelled"],
    default: "In Progress",
  },
  dueDate: { type: Date },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Update the updatedAt field before saving
taskSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Task = mongoose.model("Task", taskSchema);

// Validation for task creation
const validateTask = (task) => {
  const schema = Joi.object({
    title: Joi.string().required().min(3).max(100),
    description: Joi.string().max(500),
    status: Joi.string().valid("In Progress", "Completed", "Cancelled"),
    dueDate: Joi.date(),
  });
  return schema.validate(task);
};

// Validation for task update
const validateTaskUpdate = (task) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(100),
    description: Joi.string().max(500),
    status: Joi.string().valid("In Progress", "Completed", "Cancelled"),
    dueDate: Joi.date(),
  });
  return schema.validate(task);
};

module.exports = { Task, validateTask, validateTaskUpdate };
