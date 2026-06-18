module.exports = {
    onDispatch: function() {
        $.locate('&codeSelector').unlock('OBUS')

        // initiate experiment sequence!
        job.control.HQ.requestNewExperiment( null, env.missionStatus.time + 0.25)
    },
    onRead: function() {
    },
}
