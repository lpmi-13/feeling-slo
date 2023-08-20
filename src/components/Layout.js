import "../styles/layout.scss";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Layout = ({ children }) => {
    return (
        <div role="main" className="container">
            <div className="buttonRow">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="home"
                >
                    <Link to="/">home</Link>
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="loading"
                >
                    <Link to="/loading">Loading</Link>
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="results"
                >
                    <Link to="/results">Results</Link>
                </motion.button>
            </div>
            {children}
        </div>
    );
};

export default Layout;
