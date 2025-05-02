import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../services/api";
import toast, { Toaster } from "react-hot-toast";

const schema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const sendData = {
        name: data.name,
        email: data.email,
        password: data.password,
      };
      // TODO: Implement registration logic here
      await api.post("/auth/register", sendData).then((res) => {
        toast.success(res.data.message || "Registration successful");
        navigate("/");
      });
    } catch (error: any) {
      console.error("Registration failed:", error);
      toast.error(error.response.data.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center py-3 py-md-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="card shadow-sm border-0 rounded-4"
            >
              <div className="card-body p-3 p-md-4">
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-primary mb-2">Create Account</h2>
                  <p className="text-muted small">
                    Join TaskMaster to organize your life
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-3">
                    <label
                      htmlFor="name"
                      className="form-label small fw-medium"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.name ? "is-invalid" : ""
                      }`}
                      id="name"
                      {...register("name")}
                      placeholder="Enter your full name"
                      autoFocus
                    />
                    {errors.name && (
                      <div className="invalid-feedback">
                        {errors.name.message}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="email"
                      className="form-label small fw-medium"
                    >
                      Email address
                    </label>
                    <input
                      type="email"
                      className={`form-control ${
                        errors.email ? "is-invalid" : ""
                      }`}
                      id="email"
                      {...register("email")}
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <div className="invalid-feedback">
                        {errors.email.message}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="password"
                      className="form-label small fw-medium"
                    >
                      Password
                    </label>
                    <div className="position-relative">
                      <input
                        type="password"
                        className={`form-control ${
                          errors.password ? "is-invalid" : ""
                        }`}
                        id="password"
                        {...register("password")}
                        placeholder="Create a password"
                      />
                      <button
                        type="button"
                        className="btn btn-link position-absolute end-0 top-50 translate-middle-y p-0"
                        onClick={() => {
                          /* TODO: Implement show/hide password */
                        }}
                      >
                        <i className="bi bi-eye"></i>
                      </button>
                    </div>
                    {errors.password && (
                      <div className="invalid-feedback">
                        {errors.password.message}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="confirmPassword"
                      className="form-label small fw-medium"
                    >
                      Confirm Password
                    </label>
                    <div className="position-relative">
                      <input
                        type="password"
                        className={`form-control ${
                          errors.confirmPassword ? "is-invalid" : ""
                        }`}
                        id="confirmPassword"
                        {...register("confirmPassword")}
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        className="btn btn-link position-absolute end-0 top-50 translate-middle-y p-0"
                        onClick={() => {
                          /* TODO: Implement show/hide password */
                        }}
                      >
                        <i className="bi bi-eye"></i>
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <div className="invalid-feedback">
                        {errors.confirmPassword.message}
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 mb-3"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    ) : null}
                    Create Account
                  </button>

                  <div className="text-center mb-3">
                    <span className="text-muted small">Or continue with</span>
                  </div>

                  <div className="d-flex justify-content-center">
                    <button
                      type="button"
                      className="btn btn-outline-primary rounded-pill px-4"
                      onClick={() => {
                        /* TODO: Implement Google auth */
                      }}
                    >
                      <i className="bi bi-google me-2"></i>
                      <span className="small">Google</span>
                    </button>
                  </div>
                </form>

                <div className="text-center mt-4">
                  <span className="text-muted small">
                    Already have an account?
                  </span>{" "}
                  <Link to="/login" className="text-decoration-none small">
                    Sign in
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
