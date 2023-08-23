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
    const loadTimeData = data.map(({ delay }) => delay);
    const p50 = convertToSeconds(median(loadTimeData));
    const p90 = convertToSeconds(calcQuartile(loadTimeData, 90));

    return (
        <div>
            <h3>
                Based on your swipes, these are the SLOs that you would be
                satisfied with
            </h3>
            {data.length !== 0 ? (
                <div>
                    <p>your p50 is {p50} seconds</p>
                    <p>your p90 is {p90} seconds</p>
                </div>
            ) : (
                <p>no data yet!</p>
            )}
        </div>
    );
}
