import {
    VictoryChart,
    VictoryLabel,
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

const convertToSeconds = (milliseconds) => (milliseconds / 1000).toFixed(2);

export default function Results({ data }) {
    // first do a bit of "statistics"
    const loadTimeData = data.map(({ delay }) => delay);
    const p50 = convertToSeconds(median(loadTimeData));
    const p90 = convertToSeconds(calcQuartile(loadTimeData, 90));

    // now lets get the graph data
    const graphPoints = data.map(({ delay }, idx) => {
        // we need to fake the X axis values just so the load times show up
        // in a regular sequence
        return { x: idx, y: Number(convertToSeconds(delay)) };
    });

    const filterForP50 = ({ y }) => y > p50;
    const p50GraphPoints = graphPoints
        .filter(filterForP50)
        .map(({ y }, idx) => {
            // another hack to regenerate the values for the x axis so we can have separate lines
            return { x: idx, y };
        });
    const filterForP90 = ({ y }) => y > p90;
    const p90GraphPoints = graphPoints
        .filter(filterForP90)
        .map(({ y }, idx) => {
            // same as above
            return { x: idx, y };
        });

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
                        {convertToSeconds(Math.min(...loadTimeData))} seconds
                    </h3>
                    <h3>
                        The slowest load time was{" "}
                        {convertToSeconds(Math.max(...loadTimeData))} seconds
                    </h3>
                    <VictoryChart height={390} title="all load times">
                        <VictoryLabel
                            text="all load times"
                            x={225}
                            y={30}
                            textAnchor="middle"
                        />
                        <VictoryLine
                            interpolation={"linear"}
                            data={graphPoints}
                            style={{ data: { stroke: "green" } }}
                        />
                        <VictoryScatter
                            data={graphPoints}
                            size={4}
                            style={{ data: { fill: "green" } }}
                        />
                    </VictoryChart>
                    <VictoryChart height={390}>
                        <VictoryLabel
                            text="p50 & p90 load times"
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
                    </VictoryChart>
                </div>
            ) : (
                <p>no data yet!</p>
            )}
        </div>
    );
}
