import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const generateRandomDelay = () => {
    const delay = Math.floor(Math.random() * 3000 + 200);
    console.log(`generated a delay of ${delay} milliseconds`);
    return delay;
};

export default function Loading({ data }) {
    const [loading, setLoading] = useState(true);
    const [currentDelay, setCurrentDelay] = useState(null);

    useEffect(() => {
        const delay = generateRandomDelay();
        setCurrentDelay(delay);
        const timer = setTimeout(() => {
            setLoading(false);
            console.log(data);
        }, currentDelay);
    }, [loading]);

    const reloadOnSlow = () => {
        setLoading(true);
        data[currentDelay] = "slow";
    };

    const reloadOnFast = () => {
        setLoading(true);
        data[currentDelay] = "fast";
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
