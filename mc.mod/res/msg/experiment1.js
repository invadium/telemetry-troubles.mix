module.exports = {
    onRead: function() {
        job.control.mission.declareExperiment({
            name:      'Experiment 1',
            shortName: 'Exp1',
            reward:     500,

            verify: function(probe, MC) {
                log('verifying that the telemetry on dataline #0 is open...')
                return !!(probe.dataLines[0].telemetry)
            }
        })
    }
}
