const experiment = {
    title:     'RTG and Battery Telemetry',
    reward:     500,

    // verify that we have achieved the desired effect/state
    verify: function(probe, MC) {
        log('verifying that the telemetry on datalines #1-2 is open...')

        for (let i = 1; i <= 2; i++) {
            if (!probe.dataLines[i].telemetry) return false
        }
        return true
    },
    // next custom actions after the experiment is completed
    next: function(probe, MC) {
        signal('email', 'telemetry')
        signal('email', 'unlock-sub')
        signal('email', 'unlock-dup')
        signal('email', 'unlock-jnz')
    },
}
module.exports = experiment
