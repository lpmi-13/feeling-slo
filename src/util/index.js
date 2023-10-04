export const generateDelayInRange = (longest, shortest) => {
    return Math.floor(Math.random() * (longest - shortest + 1) + shortest);
};

export const generateDataPoints = (number, startRange, endRange) => {
    const fakeDataPoints = Array.from({ length: number }, (value) =>
        generateDelayInRange(endRange, startRange)
    );
    return fakeDataPoints;
};

// I chose this approach since I needed more obvious differences among the different random values
export const generateRandomDelay = () => {
    const choice = Math.floor(Math.random() * 3 + 1);
    switch (choice) {
        case 1:
            return generateShortDelay();
        case 2:
            return generateMediumDelay();
        case 3:
            return generateLongDelay();
        default:
            return generateShortDelay();
    }
};

const generateShortDelay = () => generateDelayInRange(600, 200);
const generateMediumDelay = () => generateDelayInRange(1500, 1200);
const generateLongDelay = () => generateDelayInRange(3000, 2200);

// shameless steal from SO
export const median = (values) => {
    values.sort((a, b) => {
        return a - b;
    });

    const half = Math.floor(values.length / 2);

    if (values.length % 2) return values[half];

    return (values[half - 1] + values[half]) / 2.0;
};

export const calcQuartile = (arr, q) => {
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

// ...and a good opportunity to steal from SO, particularly because this algorithm is called the Durstenfeld Shuffle
export const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};

const sortArr = (arr) => {
    var ary = arr.slice();
    ary.sort((a, b) => {
        return parseFloat(a) - parseFloat(b);
    });
    return ary;
};
