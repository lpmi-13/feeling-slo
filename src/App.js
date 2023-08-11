import "./App.css";
import Layout from "./components/Layout";
import Home from "./Home";
import Loading from "./Loading";
import Search from "./Search";
import Results from "./Results";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const loadingTimes = {};

function App() {
    return (
        <div className="App">
            <Router>
                <Layout>
                    <Routes>
                        <Route index path="/" element={<Home />} />
                        <Route
                            path="/loading"
                            element={<Loading data={loadingTimes} />}
                        />
                        <Route path="/search" element={<Search />} />
                        <Route path="/results" element={<Results />} />
                    </Routes>
                </Layout>
            </Router>
        </div>
    );
}

export default App;
