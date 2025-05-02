import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import AddTaskModal from "./AddTask";
import EditModal from "./EditModal";
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDelete = async () => {
    if (!selectedTask) return;

    setIsDeleting(true);
    try {
      await api.delete(`/tasks/${selectedTask._id}`);
      toast.success("Task deleted successfully");
      fetchTasks();
      setSelectedTask(null);
      setIsDeleteModalOpen(false);
    } catch (error: any) {
      console.error("Failed to delete task:", error);
      toast.error(error.response?.data?.message || "Failed to delete task");
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-success";
      case "in progress":
        return "bg-primary";
      case "cancelled":
        return "bg-danger";
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
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    <i className="bi bi-pencil me-2"></i>
                    Edit
                  </button>
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => setIsDeleteModalOpen(true)}
                  >
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

      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onTaskUpdated={fetchTasks}
        task={selectedTask}
      />

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <>
          <div
            className="modal-backdrop fade show"
            onClick={() => setIsDeleteModalOpen(false)}
          ></div>
          <div className="modal fade show d-block" tabIndex={-1} role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="modal-content"
              >
                <div className="modal-header">
                  <h5 className="modal-title">Delete Task</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setIsDeleteModalOpen(false)}
                    disabled={isDeleting}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>Are you sure you want to delete this task?</p>
                  <p className="text-danger">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    This action cannot be undone.
                  </p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setIsDeleteModalOpen(false)}
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Deleting...
                      </>
                    ) : (
                      "Delete"
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Task;
