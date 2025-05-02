import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Calendar from "react-calendar";
import { format } from "date-fns";
import api from "../services/api";
import toast from "react-hot-toast";
import "react-calendar/dist/Calendar.css";

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

function Calander() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const response = await api.get("/tasks");
      setTasks(response.data);
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
      case "cancelled":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  const getTasksForDate = (date: Date) => {
    return tasks.filter((task) => {
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const tileContent = ({ date }: { date: Date }) => {
    const tasksForDate = getTasksForDate(date);
    if (tasksForDate.length > 0) {
      return (
        <div className="position-relative">
          <div className="position-absolute top-0 end-0">
            <div
              className="rounded-circle bg-primary"
              style={{
                width: "8px",
                height: "8px",
                margin: "2px",
              }}
            />
          </div>
        </div>
      );
    }
    return null;
  };

  const tileClassName = ({ date }: { date: Date }) => {
    const tasksForDate = getTasksForDate(date);
    if (tasksForDate.length > 0) {
      return "has-tasks";
    }
    return "";
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

  const selectedTasks = getTasksForDate(selectedDate);

  return (
    <div className="container-fluid p-3">
      <div className="row g-3">
        {/* Calendar Section */}
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h4 className="card-title mb-4">Task Calendar</h4>
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileContent={tileContent}
                tileClassName={tileClassName}
                className="w-100 border-0"
              />
              <style>
                {`
                  .react-calendar {
                    width: 100%;
                    border: none;
                    font-family: inherit;
                  }
                  .react-calendar__tile--now {
                    background: #e6f7ff;
                  }
                  .react-calendar__tile--active {
                    background: #007bff !important;
                    color: white;
                  }
                  .has-tasks {
                    background: rgba(0, 123, 255, 0.1);
                  }
                  .react-calendar__tile--hasTasks {
                    background: rgba(0, 123, 255, 0.1);
                  }
                `}
              </style>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h4 className="card-title mb-4">
                Tasks for {format(selectedDate, "MMMM dd, yyyy")}
              </h4>
              {selectedTasks.length > 0 ? (
                <div className="list-group">
                  {selectedTasks.map((task) => (
                    <motion.div
                      key={task._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="list-group-item"
                    >
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="mb-0">{task.title}</h6>
                        <span
                          className={`badge ${getStatusBadgeClass(
                            task.status
                          )}`}
                        >
                          {task.status}
                        </span>
                      </div>
                      <p className="text-muted mb-0">{task.description}</p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted py-4">
                  <i className="bi bi-calendar-x fs-1 mb-3"></i>
                  <p className="mb-0">No tasks scheduled for this date</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Calander;
