import LoadingGraph from "./components/LoadingGraph";

import { generateDataPoints, shuffleArray } from "./util";

const NUMBER_OF_DATA_POINTS_TO_GENERATE = 500;

// we want to have a distribution of different load times with a fairly long tail of high load times.
// so to make the math easy (cause I couldn't find a good way to generate a gaussian distribution with long tails)
// we're going to generate N random load times, and have the following basic sub-distributions:
// load times between 2,000-3,000 ms (5% of the data)
// load times between 1,500-2,000 ms (10% of the data)
// load times between 1,200-1,500 ms (15% of the data)
// load times between 800-1,200 ms (50% of the data)
// load times between 500-800 ms (15% of the data)
// load times between 200-500 ms (5% of the data)

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
shuffleArray(fullValues);

// we're gonna refactor out the x/y stuff, since our new graph implementation doesn't need it
const fakeGraphData = fullValues.map((value, idx) => {
    return { x: idx, y: value };
});

// we'll eventually just unify this and fakeGraphData to remove x/y stuff once everything is wired up and working
const simpleFakeGraphData = fullValues.map((value, idx) => [idx, value]);

export default function Results({ data }) {
    const tooSlowLoadTimes = data
        .filter(({ fastEnough }) => !fastEnough)
        .map(({ delay }) => delay);

    // this is the value we need for the "strict" SLO, where we want to set it to try and
    // avoid all user unhappiness
    const slowestUnhappyLoadTime = Math.min(...tooSlowLoadTimes);

    // this is the value we need if we want to be a bit more lenient and set it to try
    // and approximate an average value for what makes the user unhappy
    const averageTooSlowLoadTime = Math.floor(
        tooSlowLoadTimes.reduce((acc, val) => {
            return acc + val;
        }, 0) / tooSlowLoadTimes.length
    );

    const fakeLoadTimeData = fakeGraphData.map(({ y }) => y);

    const filterForStrictUserHappiness = ({ y }) => slowestUnhappyLoadTime > y;
    const filterForLenientUserHappiness = ({ y }) => averageTooSlowLoadTime > y;

    // strictly filter out all loads slower than the fastest load that made a user unhappy
    const goodFakeDataLoads = fakeGraphData.filter(
        filterForStrictUserHappiness
    );

    const percentageOfLoadTimesBelowStrictSLO = Math.floor(
        (goodFakeDataLoads.length / fakeGraphData.length) * 100
    );

    // filter out all loads slower than the average load time that made users unhappy
    const okayFakeDataLoads = fakeGraphData.filter(
        filterForLenientUserHappiness
    );

    const percentageOfLoadTimesBelowLenientSLO = Math.floor(
        (okayFakeDataLoads.length / fakeGraphData.length) * 100
    );

    return (
        <div>
            {data.length >= 3 ? (
                <div>
                    <LoadingGraph
                        data={simpleFakeGraphData}
                        slowestUnhappy={slowestUnhappyLoadTime}
                        averageUnhappy={averageTooSlowLoadTime}
                    />
                    <p>
                        if SLO is based on the average "unacceptable" load time,
                        SLO should be "{percentageOfLoadTimesBelowLenientSLO}%
                        of load times should be faster than{" "}
                        {Number(averageTooSlowLoadTime / 1000).toFixed(2)}{" "}
                        seconds"
                    </p>
                    <p>
                        If SLO is based on the fastest "unacceptable" load time,
                        SLO should be "{percentageOfLoadTimesBelowStrictSLO}% of
                        load times should be faster than{" "}
                        {Number(slowestUnhappyLoadTime / 1000).toFixed(2)}{" "}
                        seconds"
                    </p>
                </div>
            ) : (
                <p>no data yet!</p>
            )}
        </div>
    );
}
