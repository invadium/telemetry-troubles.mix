const experiment = {
    title:     'Attitude telemetry',
    reward:     500,
    essential:  false,  // indicates if this experiment is essential or can be skipped by the mission control

    verify: function(probe, MC) {
        log('verifying that the telemetry on dataline #0 is open...')
        return !!(probe.dataLines[0].telemetry)
    }
}
module.exports = experiment
