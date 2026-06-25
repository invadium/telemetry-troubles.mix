const experiment = {
    title:     'DUSTY-12 loop',
    reward:     1500,
    hold:       8,
    estimate:   2,      // estimate solution time in days

    prerequisites: function(probe) {
        const eS = job.control.emailScheduler
        eS.sendAfter('unlock-jnz', 2)
    },

    // verify that we have achieved the desired effect/state
    verify: function(probe, MC) {
        log('[experiment] verifying values on stack...')

        const state = probe.dusty.spy.state()
        dir(state.dstack)
        // TODO verify somehow?

        return false
        // return true
    },
}
module.exports = experiment
