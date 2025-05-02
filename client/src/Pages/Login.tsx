import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../services/api";
import toast, { Toaster } from "react-hot-toast";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

function Login() {
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
        email: data.email,
        password: data.password,
      };

      await api.post("/auth/login", sendData).then((res) => {
        toast.success(res.data.message || "Login successful");
        navigate("/");
      });
    } catch (error: any) {
      console.error("Login failed:", error);
      toast.error(error.response?.data?.message || "Login failed");
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
                  <h2 className="fw-bold text-primary mb-2">Welcome Back</h2>
                  <p className="text-muted small">
                    Sign in to continue to TaskMaster
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
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
                      autoFocus
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
                        placeholder="Enter your password"
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

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="rememberMe"
                        {...register("rememberMe")}
                      />
                      <label
                        className="form-check-label small"
                        htmlFor="rememberMe"
                      >
                        Remember me
                      </label>
                    </div>
                    <Link
                      to="/forgot-password"
                      className="small text-decoration-none"
                    >
                      Forgot password?
                    </Link>
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
                    Sign In
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
                    Don't have an account?
                  </span>{" "}
                  <Link to="/register" className="text-decoration-none small">
                    Sign up
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

export default Login;
