import { VictoryBar, VictoryChart } from "victory";
const style = {
    data: {
        fill: "tomato",
    },
};
export default function Results({ data }) {
    // because we need a deep copy of the array of objects
    let tempData = JSON.parse(JSON.stringify(data));
    // just in case somebody navigates here first without recording any preferences
    const reduced =
        data.length !== 0
            ? tempData.reduce((sum, perception) => {
                  sum[perception.fastEnough] =
                      (sum[perception.fastEnough] || 0) + 1;
                  return sum;
              })
            : { true: 0, false: 0 };

    return (
        <div>
            <h3>
                Based on your swipes, these are the SLOs that you would be
                satisfied with
            </h3>
            {data.length !== 0 ? (
                <VictoryChart
                    height={400}
                    width={400}
                    domainPadding={{ x: 50, y: [0, 20] }}
                >
                    <VictoryBar
                        style={style}
                        data={[
                            { x: "too slow", y: reduced.false || 0 },
                            { x: "fast enough", y: reduced.true || 0 },
                        ]}
                    />
                </VictoryChart>
            ) : (
                <p>no data yet!</p>
            )}
        </div>
    );
}
