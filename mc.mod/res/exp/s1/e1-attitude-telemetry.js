const experiment = {
    title:     'Attitude telemetry',
    shortName: 'Exp1',
    reward:     1000,

    verify: function(probe, MC) {
        log('verifying that the telemetry on dataline #0 is open...')
        return !!(probe.dataLines[0].telemetry)
    }
}
module.exports = experiment
