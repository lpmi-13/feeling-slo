import { Chart } from "react-google-charts";

export const defaultData = [["Observations", "Load times in milliseconds"]];

export const options = {
    chart: {
        title: "Potential SLOs",
    },
};

const LoadingGraph = ({ data }) => {
    return (
        <Chart
            chartType="Line"
            width="100%"
            height="400px"
            data={[...defaultData, data]}
            options={options}
        />
    );
};

export default LoadingGraph;
