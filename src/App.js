import { useState } from "react";
import "./App.css";
import Layout from "./components/Layout";
import Home from "./Home";
import Loading from "./Loading";
import Results from "./Results";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { generateRandomDelay } from "./util";

const loadingTimes = [];

const addData = (delay, fastEnough) => {
    loadingTimes.push({ delay, fastEnough });
};

function App() {
    const [currentDelay, setCurrentDelay] = useState(generateRandomDelay);

    // we only count the times when the user specified "not fast enough" because that's what
    // we need to calculate potential SLOs. We don't care about when the users are happy as
    // much as we care about what makes the users unhappy.
    const numberOfDataPoints = loadingTimes.filter(
        ({ fastEnough }) => fastEnough === false
    ).length;

    const incrementDataPointsCounter = () => {
        setCurrentDelay(generateRandomDelay);
    };

    return (
        <div className="App">
            <Router>
                <Layout dataPoints={numberOfDataPoints}>
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
