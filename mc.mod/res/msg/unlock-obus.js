module.exports = {
    onDispatch: function() {
        const codeSelector = $.locate('&codeSelector')
        codeSelector.unlock('OBUS')

        job.control.HQ.requestNewExperiment( null, env.missionStatus.time + 0.25)
    },
    onRead: function() {
    },
}
