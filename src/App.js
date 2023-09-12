import { useState } from "react";
import "./App.css";
import Layout from "./components/Layout";
import Home from "./Home";
import Loading from "./Loading";
import Results from "./Results";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const loadingTimes = [];

// I chose this approach since I needed more obvious differences among the different random values
const generateRandomDelay = () => {
    const choice = Math.floor(Math.random() * 3 + 1);
    switch (choice) {
        case 1:
            return generateShortDelay();
        case 2:
            return generateMediumDelay();
        case 3:
            return generateLongDelay();
        default:
            return generateShortDelay();
    }
};

const generateShortDelay = () => generateDelayInRange(600, 200);
const generateMediumDelay = () => generateDelayInRange(1500, 1200);
const generateLongDelay = () => generateDelayInRange(3000, 2200);

const generateDelayInRange = (longest, shortest) => {
    const delay = Math.floor(Math.random() * longest + shortest);
    console.log(`generated a delay of ${delay} milliseconds`);
    return delay;
};

const addData = (delay, fastEnough) => {
    loadingTimes.push({ delay, fastEnough });
};

function App() {
    const [dataPoints, setDataPoints] = useState(0);
    const [currentDelay, setCurrentDelay] = useState(generateRandomDelay);

    const incrementDataPointsCounter = () => {
        setCurrentDelay(generateRandomDelay);
        setDataPoints(dataPoints + 1);
    };

    return (
        <div className="App">
            <Router>
                <Layout>
                    <div>current data points: {dataPoints}</div>
                    <Routes>
                        <Route index path="/" element={<Home />} />
                        <Route
                            path="/loading"
                            element={
                                <Loading
                                    addData={addData}
                                    currentDelay={currentDelay}
                                    handleIncrement={incrementDataPointsCounter}
                                />
                            }
                        />
                        <Route
                            path="/results"
                            element={<Results data={loadingTimes} />}
                        />
                    </Routes>
                </Layout>
            </Router>
        </div>
    );
}

export default App;
