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
                    that would be relevant given the sample data set (500
                    randomly generated load times) and your responses to the
                    actual loading speed you experienced.
                </p>
                <p>
                    As a simple example, if the average load speed you were
                    unhappy with was 2 seconds, and 80% of the sample data
                    included load times that were faster than that, you might
                    set an SLO like: "80% of page loads are faster than 2
                    seconds"
                </p>
                <p>
                    For a more complicated example, we can take the total data
                    points where the user indicated the page load speed was too
                    slow and convert that into quartiles (this is obviously
                    easier with more data points, so we'll probably wanna
                    somehow prompt that this analysis isn't ready until the user
                    clicks enough times). We can then say things like: 1.5
                    seconds was faster than 50% of the loading speeds the user
                    was unhappy with, 1 second was faster than 90% of the
                    loading speeds the user was unhappy with, and 900
                    milliseconds was faster than 95% of the loading speeds the
                    user was unhappy with.
                </p>
                <p>
                    We could also provide an analysis (which isn't, strictly
                    speaking, on SLOs) like: we can see that 60% of the
                    responses made the user happy and 40% of the responses made
                    the user unhappy. You would need to improve the average
                    speed of the site by 300 milliseconds to improve user
                    happiness by 5%, 750 milliseconds to improve user happiness
                    by 15%, and 1200 milliseconds to improve user happiness by
                    20%.
                </p>
            </div>
        </div>
    );
}
