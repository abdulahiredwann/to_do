import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // TODO: Implement login logic
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated API call
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
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

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label
                      htmlFor="email"
                      className="form-label small fw-medium"
                    >
                      Email address
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      autoFocus
                    />
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
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
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
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="remember"
                      />
                      <label
                        className="form-check-label small"
                        htmlFor="remember"
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

                  {error && (
                    <div className="alert alert-danger small" role="alert">
                      {error}
                    </div>
                  )}

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
