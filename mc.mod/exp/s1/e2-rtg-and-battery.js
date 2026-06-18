const experiment = {
    title:     'RTG and Battery Telemetry',
    reward:     1000,

    // verify that we have achieved the desired effect/state
    verify: function(probe, MC) {
        log('verifying that the telemetry on datalinees #1-2 is open...')

        for (let i = 1; i < 2; i++) {
            if (!probe.dataLines[i].telemetry) return false
        }
        return true
    },
    // next custom actions after the experiment is completed
    next: function(probe, MC) {
        signal('email', 'telemetry')
    },
}
module.exports = experiment
