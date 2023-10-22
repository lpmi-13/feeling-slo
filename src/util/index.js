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

// ...and a good opportunity to steal from SO, particularly because this algorithm is called the Durstenfeld Shuffle
export const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};
