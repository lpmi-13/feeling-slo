import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Loading({ addData, currentDelay, handleIncrement }) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, currentDelay);
    }, [currentDelay, loading]);

    const reloadOnSlow = () => {
        handleIncrement();
        addData(currentDelay, false);
        setLoading(true);
    };

    const reloadOnFast = () => {
        handleIncrement();
        addData(currentDelay, true);
        setLoading(true);
    };

    return loading ? (
        <span className="loader"></span>
    ) : (
        <div>
            <h1>This is main landing page...did it load fast enough?</h1>
            <div className="buttonRow">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="too slow"
                    onClick={reloadOnSlow}
                >
                    Too Slow
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="fast enough"
                    onClick={reloadOnFast}
                >
                    Fast Enough
                </motion.button>
            </div>
        </div>
    );
}
