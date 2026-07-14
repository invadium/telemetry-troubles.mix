const experiment = {
    title:     'Power High-Gain Dish',
    reward:     600,
    estimate:   2,      // estimate solution time in days
    hold:       10,

    prerequisites: function(probe) {
        const eS = job.control.emailScheduler
        eS.sendAfter('powerlines',  2)
        eS.sendAfter('unlock-opow', 4)
    },

    // verify that we have achieved the desired effect/state
    verify: function(probe, MC) {
        log('verifying that the antenna dataline is open...')

        if (probe.powerLines[ probe.ANTENNA ]) return true

        return false
    },

    // next custom actions after the experiment is completed
    next: function(probe, MC) {
        const eS = job.control.emailScheduler
        eS.sendAfter('unlock-all', 10)
    },
}
module.exports = experiment
