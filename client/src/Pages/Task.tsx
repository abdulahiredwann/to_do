import React, { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";

// Fake data for tasks
const fakeTasks = [
  {
    id: 1,
    title: "Complete Project Documentation",
    description:
      "Write comprehensive documentation for the project including setup instructions, API documentation, and user guides.",
    startDate: "2024-03-15",
    dueDate: "2024-03-20",
    status: "pending",
  },
  {
    id: 2,
    title: "Fix Login Bug",
    description:
      "Investigate and fix the issue with user authentication failing on mobile devices.",
    startDate: "2024-03-16",
    dueDate: "2024-03-18",
    status: "in-progress",
  },
  {
    id: 3,
    title: "Update Dependencies",
    description:
      "Update all project dependencies to their latest versions and ensure compatibility.",
    startDate: "2024-03-20",
    dueDate: "2024-03-25",
    status: "pending",
  },
  {
    id: 4,
    title: "Implement Dark Mode",
    description:
      "Add dark mode support to the application with a toggle switch in the settings.",
    startDate: "2024-03-18",
    dueDate: "2024-03-22",
    status: "completed",
  },
];

function Task() {
  const [selectedTask, setSelectedTask] = useState(fakeTasks[0]);
  const [isAddingTask, setIsAddingTask] = useState(false);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-success";
      case "in-progress":
        return "bg-primary";
      case "pending":
        return "bg-secondary";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div className="container-fluid p-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">My Tasks</h2>
        <button
          className="btn btn-primary"
          onClick={() => setIsAddingTask(true)}
        >
          <i className="bi bi-plus-lg me-2"></i>
          Add Task
        </button>
      </div>

      <div className="row g-3">
        {/* Task List */}
        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                {fakeTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <button
                      className={`list-group-item list-group-item-action ${
                        selectedTask.id === task.id ? "active" : ""
                      }`}
                      onClick={() => setSelectedTask(task)}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <h6 className="mb-1">{task.title}</h6>
                        <span
                          className={`badge ${getStatusBadgeClass(
                            task.status
                          )}`}
                        >
                          {task.status}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          Start: {format(new Date(task.startDate), "MMM dd")}
                        </small>
                        <small className="text-muted">
                          Due: {format(new Date(task.dueDate), "MMM dd")}
                        </small>
                      </div>
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Task Details */}
        <div className="col-md-8">
          <motion.div
            key={selectedTask.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="card shadow-sm h-100"
          >
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="card-title mb-0">{selectedTask.title}</h4>
                <span
                  className={`badge ${getStatusBadgeClass(
                    selectedTask.status
                  )}`}
                >
                  {selectedTask.status}
                </span>
              </div>
              <div className="d-flex gap-4 mb-3">
                <p className="text-muted mb-0">
                  <i className="bi bi-calendar-event me-2"></i>
                  Start:{" "}
                  {format(new Date(selectedTask.startDate), "MMMM dd, yyyy")}
                </p>
                <p className="text-muted mb-0">
                  <i className="bi bi-calendar-check me-2"></i>
                  Due: {format(new Date(selectedTask.dueDate), "MMMM dd, yyyy")}
                </p>
              </div>
              <div className="card-text">
                <h6 className="mb-2">Description</h6>
                <p className="text-muted">{selectedTask.description}</p>
              </div>
              <div className="mt-4 d-flex gap-2">
                <button className="btn btn-outline-primary">
                  <i className="bi bi-pencil me-2"></i>
                  Edit
                </button>
                <button className="btn btn-outline-danger">
                  <i className="bi bi-trash me-2"></i>
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Task;
