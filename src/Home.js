export default function Home() {
    return (
        <div>
            <div>This app has three sections:</div>
            <ol>
                <li>this explanation page</li>
                <li>
                    the main "Loading page" where you react to the page loading
                    speed
                </li>
                <li>
                    the results page where you can see what SLOs you would be
                    comfortable with based on your reactions
                </li>
            </ol>
            <div className="intro">
                <p>
                    This is an app to practice feeling how SLOs are actually
                    related to user experience. On the "Loading page", you'll
                    get a randomly generated delay in the page load.
                </p>
                <p>
                    When the load speed is too slow, click the "too slow"
                    button. If the load speed is okay, click the "fast enough"
                    button.
                </p>
                <p>
                    Based on these clicks, we'll generate a few example SLOs
                    that would be relevant given the sample data set (a bunch of
                    randomly generated load times between 200 - 3,000
                    milliseconds) and your responses to the actual loading speed
                    you experienced.
                </p>
                <p>
                    As a simple example, if the average load speed you were
                    unhappy with was 2 seconds, and 80% of the sample data
                    included load times that were faster than that, you might
                    set an SLO like: "80% of page loads are faster than 2
                    seconds"
                </p>
            </div>
        </div>
    );
}
