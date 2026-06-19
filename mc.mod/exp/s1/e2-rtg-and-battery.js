const experiment = {
    title:     'RTG and Battery Telemetry',
    reward:     500,
    embargo:    15,

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
        const eS = job.control.emailScheduler
        eS.sendAfter('telemetry',  1)
        eS.sendAfter('unlock-sub', 3)
        eS.sendAfter('unlock-dup', 4)
        eS.sendAfter('unlock-jnz', 7)
    },
}
module.exports = experiment
