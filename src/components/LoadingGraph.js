import { Chart } from "react-google-charts";

export const defaultData = [
    ["Observations", "Load times in milliseconds", "lenient SLO", "strict SLO"],
];

export const options = {
    chart: {
        title: "Potential SLOs",
    },
};

const LoadingGraph = ({ averageUnhappy, data, slowestUnhappy }) => {
    // hack it!
    let modifiedData = [];
    data.forEach(([index, value]) => {
        modifiedData.push([index, value, slowestUnhappy, averageUnhappy]);
    });

    return (
        <Chart
            chartType="Line"
            width="100%"
            height="400px"
            data={defaultData.concat(modifiedData)}
            options={options}
        />
    );
};

export default LoadingGraph;
