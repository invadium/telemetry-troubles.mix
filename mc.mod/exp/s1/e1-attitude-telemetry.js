const experiment = {
    title:     'Attitude telemetry',
    reward:     500,

    verify: function(probe, MC) {
        log('verifying that the telemetry on dataline #0 is open...')
        return !!(probe.dataLines[0].telemetry)
    }
}
module.exports = experiment
