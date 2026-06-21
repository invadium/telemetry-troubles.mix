const experiment = {
    title:     'Stack Inspector',
    reward:     500,
    embargo:    10,

    // verify that we have achieved the desired effect/state
    verify: function(probe, MC) {
        log('verifying that the telemetry on datalines #7 is open...')

        if (!probe.dataLines[7].telemetry) return false
        else return true
    },
    // next custom actions after the experiment is completed
    next: function(probe, MC) {
        const eS = job.control.emailScheduler
        eS.sendAfter('unlock-add', 3)
        eS.sendAfter('unlock-sub', 4)
    },
}
module.exports = experiment
