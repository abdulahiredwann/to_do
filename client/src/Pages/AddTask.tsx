import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const schema = z
  .object({
    title: z.string().min(1, "Title is required").max(100, "Title is too long"),
    description: z
      .string()
      .min(1, "Description is required")
      .max(500, "Description is too long"),
    startDate: z.string().min(1, "Start date is required"),
    dueDate: z.string().min(1, "Due date is required"),
  })
  .refine(
    (data) => {
      const startDate = new Date(data.startDate);
      const dueDate = new Date(data.dueDate);
      return startDate <= dueDate;
    },
    {
      message: "Due date must be after start date",
      path: ["dueDate"],
    }
  );

type FormData = z.infer<typeof schema>;

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskAdded: () => void;
}

function AddTaskModal({ isOpen, onClose, onTaskAdded }: AddTaskModalProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await api.post("/tasks", data);
      toast.success("Task created successfully");
      reset();
      onClose();
      onTaskAdded();
      navigate("/tasks");
    } catch (error: any) {
      console.error("Failed to create task:", error);
      toast.error(error.response?.data?.message || "Failed to create task");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-backdrop fade show" onClick={onClose}></div>
      <div className="modal fade show d-block" tabIndex={-1} role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="modal-content"
          >
            <div className="modal-header">
              <h5 className="modal-title">Add New Task</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                disabled={isLoading}
              ></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.title ? "is-invalid" : ""
                    }`}
                    id="title"
                    {...register("title")}
                    placeholder="Enter task title"
                  />
                  {errors.title && (
                    <div className="invalid-feedback">
                      {errors.title.message}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    className={`form-control ${
                      errors.description ? "is-invalid" : ""
                    }`}
                    id="description"
                    rows={4}
                    {...register("description")}
                    placeholder="Enter task description"
                  ></textarea>
                  {errors.description && (
                    <div className="invalid-feedback">
                      {errors.description.message}
                    </div>
                  )}
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="startDate" className="form-label">
                      Start Date
                    </label>
                    <input
                      type="date"
                      className={`form-control ${
                        errors.startDate ? "is-invalid" : ""
                      }`}
                      id="startDate"
                      {...register("startDate")}
                    />
                    {errors.startDate && (
                      <div className="invalid-feedback">
                        {errors.startDate.message}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="dueDate" className="form-label">
                      Due Date
                    </label>
                    <input
                      type="date"
                      className={`form-control ${
                        errors.dueDate ? "is-invalid" : ""
                      }`}
                      id="dueDate"
                      {...register("dueDate")}
                    />
                    {errors.dueDate && (
                      <div className="invalid-feedback">
                        {errors.dueDate.message}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Creating...
                    </>
                  ) : (
                    "Create Task"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default AddTaskModal;
