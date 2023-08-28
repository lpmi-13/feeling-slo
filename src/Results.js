import {
    VictoryChart,
    VictoryLabel,
    VictoryLegend,
    VictoryLine,
    VictoryScatter,
} from "victory";
// shameless steal from SO
const median = (values) => {
    values.sort((a, b) => {
        return a - b;
    });

    const half = Math.floor(values.length / 2);

    if (values.length % 2) return values[half];

    return (values[half - 1] + values[half]) / 2.0;
};

const calcQuartile = (arr, q) => {
    const a = arr.slice();
    // Turn q into a decimal (e.g. 95 becomes 0.95)
    q = q / 100;

    // Sort the array into ascending order
    const data = sortArr(a);

    // Work out the position in the array of the percentile point
    const p = (data.length - 1) * q;
    const b = Math.floor(p);

    // Work out what we rounded off (if anything)
    const remainder = p - b;

    // See whether that data exists directly
    if (data[b + 1] !== undefined) {
        return (
            parseFloat(data[b]) +
            remainder * (parseFloat(data[b + 1]) - parseFloat(data[b]))
        );
    } else {
        return parseFloat(data[b]);
    }
};

const sortArr = (arr) => {
    var ary = arr.slice();
    ary.sort((a, b) => {
        return parseFloat(a) - parseFloat(b);
    });
    return ary;
};

const generateRandomRange = () => {
    const range = Math.floor(Math.random() * 3000 + 200);
    return Number((range / 1000).toFixed(2));
};

export default function Results({ data }) {
    const numberOfFakeDataPoints = Array.from(
        { length: 100 },
        (value, idx) => idx
    );

    const tooSlowLoadTimes = data
        .filter(({ fastEnough }) => !fastEnough)
        .map(({ delay }) => delay);

    // this is value we want to set as the lower bound for calcuating the SLO
    const slowestUnhappyLoadTime = Math.min(...tooSlowLoadTimes);

    // could probably do this in one line with the above, but it's a hackday!
    const fakeData = numberOfFakeDataPoints.map((idx) => {
        return { x: idx, y: generateRandomRange() };
    });

    const fakeLoadTimeData = fakeData.map(({ y }) => y);
    const p50 = median(fakeLoadTimeData);
    const p90 = calcQuartile(fakeLoadTimeData, 90);

    const filterForP50 = ({ y }) => p50 < y && y < p90;
    const p50GraphPoints = fakeData.filter(filterForP50).map(({ y }, idx) => {
        // another hack to regenerate the values for the x axis so we can have separate lines
        return { x: idx, y };
    });

    const filterForP90 = ({ y }) => p90 < y;
    const p90GraphPoints = fakeData.filter(filterForP90).map(({ y }, idx) => {
        // same as above
        return { x: idx, y };
    });

    const filterForSlowestUnhappyLoadTime = ({ y }) =>
        Number(slowestUnhappyLoadTime / 1000).toFixed(2) > y;

    const goodFakeDataLoads = fakeData.filter(filterForSlowestUnhappyLoadTime);

    const percentageOfLoadTimeBelowSLO = Math.floor(
        (goodFakeDataLoads.length / fakeData.length) * 100
    );

    return (
        <div>
            <h1>
                Based on your swipes, these are the SLOs that you would be
                satisfied with
            </h1>
            {data.length !== 0 ? (
                <div>
                    <h3>
                        The fastest load time was{" "}
                        {Math.min(...fakeLoadTimeData)} seconds
                    </h3>
                    <h3>
                        The slowest load time was{" "}
                        {Math.max(...fakeLoadTimeData)} seconds
                    </h3>
                    <VictoryChart
                        domain={{
                            x: [0, p90GraphPoints.length],
                            y: [0, Math.max(...fakeLoadTimeData) + 1],
                        }}
                        height={390}
                        title="p50 and p90 load times in seconds"
                    >
                        <VictoryLabel
                            text="load time in seconds"
                            x={225}
                            y={30}
                            textAnchor="middle"
                        />
                        <VictoryLine
                            interpolation={"linear"}
                            data={p50GraphPoints}
                            style={{ data: { stroke: "blue" } }}
                        />
                        <VictoryScatter
                            data={p50GraphPoints}
                            size={4}
                            style={{ data: { fill: "blue" } }}
                        />
                        <VictoryLine
                            interpolation={"linear"}
                            data={p90GraphPoints}
                            style={{ data: { stroke: "red" } }}
                        />
                        <VictoryScatter
                            data={p90GraphPoints}
                            size={4}
                            style={{ data: { fill: "red" } }}
                        />
                        <VictoryLegend
                            x={50}
                            y={50}
                            centerTitle
                            orientation="horizontal"
                            gutter={20}
                            style={{
                                border: { stroke: "black" },
                                title: { fontSize: 20 },
                            }}
                            data={[
                                { name: "p50", symbol: { fill: "blue" } },
                                { name: "p90", symbol: { fill: "red" } },
                            ]}
                        />
                    </VictoryChart>
                    <p>
                        this is the percent of load times that were faster than
                        the slowest time the user was unhappy about:{" "}
                        {Number(slowestUnhappyLoadTime / 1000).toFixed(2)}{" "}
                        seconds
                    </p>
                    <p>{percentageOfLoadTimeBelowSLO}%</p>
                </div>
            ) : (
                <p>no data yet!</p>
            )}
        </div>
    );
}
