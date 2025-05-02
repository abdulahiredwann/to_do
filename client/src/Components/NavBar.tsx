import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../Context/AuthContext";
import { useContext, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

function NavBar() {
  const authContext = useContext(AuthContext);
  const { user, setUser, loading } = authContext || {
    user: null,
    setUser: () => {},
    loading: true,
  };
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
      setIsDropdownOpen(false);
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to logout");
    }
  };

  if (loading) {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top shadow-sm">
        <div className="container">
          <Link to="/" className="navbar-brand text-primary fw-bold">
            TaskMaster
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top shadow-sm">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/" className="navbar-brand text-primary fw-bold">
            TaskMaster
          </Link>
        </motion.div>

        <div className="d-flex align-items-center gap-3">
          {user ? (
            <div className="dropdown">
              <button
                className="btn btn-link text-decoration-none dropdown-toggle d-flex align-items-center"
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                aria-expanded={isDropdownOpen}
              >
                <div
                  className="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2"
                  style={{ width: "40px", height: "40px", fontSize: "1.2rem" }}
                >
                  {user.email.charAt(0).toUpperCase()}
                </div>
                <i className="bi bi-chevron-down small"></i>
              </button>
              {isDropdownOpen && (
                <div
                  className="dropdown-menu show"
                  style={{ right: 0, left: "auto" }}
                >
                  <div className="dropdown-item-text">
                    <small className="text-muted">Signed in as</small>
                    <div className="fw-bold">{user.email}</div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link
                    to="/tasks"
                    className="dropdown-item"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <i className="bi bi-list-task me-2"></i>
                    My Tasks
                  </Link>
                  <Link
                    to="/tasks/new"
                    className="dropdown-item"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    Add Task
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button
                    className="dropdown-item text-danger"
                    onClick={handleLogout}
                  >
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline-primary">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
