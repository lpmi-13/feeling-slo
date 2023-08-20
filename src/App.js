import { useState } from "react";
import "./App.css";
import Layout from "./components/Layout";
import Home from "./Home";
import Loading from "./Loading";
import Results from "./Results";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const loadingTimes = [];

const generateRandomDelay = () => {
    const delay = Math.floor(Math.random() * 3000 + 200);
    console.log(`generated a delay of ${delay} milliseconds`);
    return delay;
};

const addData = (delay, fastEnough) => {
    loadingTimes.push({ delay, fastEnough });
    console.log(loadingTimes);
};

function App() {
    const [dataPoints, setDataPoints] = useState(0);
    const [currentDelay, setCurrentDelay] = useState(500);

    const incrementDataPointsCounter = () => {
        setCurrentDelay(generateRandomDelay());
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
