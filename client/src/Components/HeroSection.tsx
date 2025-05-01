import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function HeroSection() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const texts = [
    "Your Tasks, Your Way",
    "Stay Organized, Stay Productive",
    "Simple, Fast, Effective",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, 3000); // Change text every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-vh-100 min-height-89 d-flex align-items-center py-5">
      <div className="container">
        <div className="row align-items-center g-4">
          <div className="col-12 col-md-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="display-4 fw-bold text-primary mb-4">
                Organize Your Life
              </h1>
              <p className="lead text-secondary mb-4">
                The ultimate task management platform to help you stay
                productive and organized. Track, manage, and complete your tasks
                with ease.
              </p>
              <Link to="/register" className="btn btn-primary btn-lg">
                Get Started
              </Link>
            </motion.div>
          </div>
          <div className="col-12 col-md-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="bg-primary rounded-4 p-5 h-100 d-flex align-items-center justify-content-center position-relative overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTextIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                  >
                    <h2 className="text-white mb-0">
                      {texts[currentTextIndex]}
                    </h2>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
