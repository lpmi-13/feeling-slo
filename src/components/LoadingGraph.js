import { Chart } from "react-google-charts";

export const defaultData = [["x", "time", "mild", "strict"]];

export const options = {
    title: "Potential SLOs",
    colors: ["blue", "orange", "red"],
    vAxis: {
        title: "milliseconds",
    },
    hAxis: {
        textPosition: "none",
    },
    legend: { position: "bottom" },
};

const LoadingGraph = ({ averageUnhappy, data, slowestUnhappy }) => {
    // hack it!
    let modifiedData = [];
    // we need to add the values for the computed SLOs into each array element of the 2D array
    data.forEach(([index, value]) => {
        modifiedData.push([index, value, averageUnhappy, slowestUnhappy]);
    });

    return (
        <Chart
            chartType="LineChart"
            width="100%"
            height="18em"
            data={defaultData.concat(modifiedData)}
            options={options}
        />
    );
};

export default LoadingGraph;
