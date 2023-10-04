import {
    VictoryChart,
    VictoryLabel,
    VictoryLegend,
    VictoryLine,
    VictoryScatter,
} from "victory";

const NUMBER_OF_DATA_POINTS_TO_GENERATE = 500;

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

// we want to have a distribution of different load times with a fairly long tail of high load times.
// so to make the math easy (cause I couldn't find a good way to generate a gaussian distribution with long tails)
// we're going to generate 1,000 random load times, and have the following basic sub-distributions:
// 50 load times between 2,000-3,000 ms (5% of the data)
// 100 load times between 1,500-2,000 ms (10% of the data)
// 150 load times between 1,200-1,500 ms (15% of the data)
// 500 load times between 800-1,200 ms (50% of the data)
// 150 load times between 500-800 ms (15% of the data)
// 50 load times between 200-500 ms (5% of the data)

// this is the same fuction used in App.js, so we'll pull them both out into a utilities file or something
const generateDelayInRange = (longest, shortest) => {
    return Math.floor(Math.random() * (longest - shortest + 1) + shortest);
};

const generateDataPoints = (number, startRange, endRange) => {
    const fakeDataPoints = Array.from({ length: number }, (value) =>
        generateDelayInRange(endRange, startRange)
    );
    return fakeDataPoints;
};

// load times between 2,000-3,000 ms (5% of the data)
const verySlowLoadTimes = generateDataPoints(
    NUMBER_OF_DATA_POINTS_TO_GENERATE * 0.05,
    2000,
    3000
);

// load times between 1,500-2,000 ms (10% of the data)
const fairlySlowLoadTimes = generateDataPoints(
    NUMBER_OF_DATA_POINTS_TO_GENERATE * 0.1,
    1500,
    2000
);

// load times between 1,200-1,500 ms (15% of the data)
const slowLoadTimes = generateDataPoints(
    NUMBER_OF_DATA_POINTS_TO_GENERATE * 0.15,
    1200,
    1500
);

// load times between 800-1,200 ms (50% of the data)
const normalLoadTimes = generateDataPoints(
    NUMBER_OF_DATA_POINTS_TO_GENERATE * 0.5,
    800,
    1200
);

// load times between 500-800 ms (15% of the data)
const fastLoadTimes = generateDataPoints(
    NUMBER_OF_DATA_POINTS_TO_GENERATE * 0.15,
    500,
    800
);

// load times between 200-500 ms (5% of the data)
const veryFastLoadTimes = generateDataPoints(
    NUMBER_OF_DATA_POINTS_TO_GENERATE * 0.05,
    200,
    500
);

// now we have a bunch of arrays with varying load times, so we put them all together
const fullValues = verySlowLoadTimes.concat(
    fairlySlowLoadTimes,
    slowLoadTimes,
    normalLoadTimes,
    fastLoadTimes,
    veryFastLoadTimes
);

// and now we want to shuffle the values completely randomly, to simulate a real load time graph
// ...and a good opportunity to steal from SO, particularly because this algorithm is called the Durstenfeld Shuffle
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

shuffleArray(fullValues);

// and for the last transformation, we just need to give all the load times an X coordinate so we can plot them
const fakeGraphData = fullValues.map((value, idx) => {
    return { x: idx, y: value };
});

export default function Results({ data }) {
    const numberOfFakeDataPoints = Array.from(
        { length: NUMBER_OF_DATA_POINTS_TO_GENERATE },
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
                Based on your choices, these are the SLOs that you would be
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
                        SLO should be "{percentageOfLoadTimeBelowSLO}% of load
                        times should be faster than{" "}
                        {Number(slowestUnhappyLoadTime / 1000).toFixed(2)}{" "}
                        seconds"
                    </p>
                    <p>{percentageOfLoadTimeBelowSLO}%</p>
                </div>
            ) : (
                <p>no data yet!</p>
            )}
        </div>
    );
}
