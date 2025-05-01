import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function NavBar() {
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

        <div className="d-flex gap-2">
          <Link to="/login" className="btn btn-outline-primary">
            Login
          </Link>
          <Link to="/register" className="btn btn-primary">
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
