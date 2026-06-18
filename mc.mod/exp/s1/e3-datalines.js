const experiment = {
    title:     'Open All Datalines',
    reward:     2000,

    // verify that we have achieved the desired effect/state
    verify: function(probe, MC) {
        log('verifying that the telemetry on datalines #3-7 is open...')

        for (let i = 3; i <= 7; i++) {
            if (!probe.dataLines[i].telemetry) return false
        }
        return true
    },
}
module.exports = experiment
