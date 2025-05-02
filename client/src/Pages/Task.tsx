import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import AddTaskModal from "./AddTask";
import api from "../services/api";
import toast from "react-hot-toast";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  dueDate: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}

function Task() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const response = await api.get("/tasks");
      setTasks(response.data);
      if (response.data.length > 0) {
        setSelectedTask(response.data[0]);
      }
    } catch (error: any) {
      console.error("Failed to fetch tasks:", error);
      toast.error(error.response?.data?.message || "Failed to fetch tasks");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-success";
      case "in progress":
        return "bg-primary";
      case "pending":
        return "bg-secondary";
      default:
        return "bg-secondary";
    }
  };

  if (isLoading) {
    return (
      <div className="container-fluid p-3">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "80vh" }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">My Tasks</h2>
        <button
          className="btn btn-primary"
          onClick={() => setIsAddTaskModalOpen(true)}
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
                {tasks.map((task) => (
                  <motion.div
                    key={task._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <button
                      className={`list-group-item list-group-item-action ${
                        selectedTask?._id === task._id ? "active" : ""
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
                      <small className="text-muted">
                        Due: {format(new Date(task.dueDate), "MMM dd, yyyy")}
                      </small>
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Task Details */}
        <div className="col-md-8">
          {selectedTask ? (
            <motion.div
              key={selectedTask._id}
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
                <p className="text-muted mb-3">
                  <i className="bi bi-calendar-check me-2"></i>
                  Due: {format(new Date(selectedTask.dueDate), "MMMM dd, yyyy")}
                </p>
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
          ) : (
            <div className="card shadow-sm h-100">
              <div className="card-body d-flex justify-content-center align-items-center">
                <p className="text-muted mb-0">Select a task to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onTaskAdded={fetchTasks}
      />
    </div>
  );
}

export default Task;
