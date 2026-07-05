const experiment = {
    title:     'Advanced Math Functions Test',
    reward:     850,

    prerequisites: function(probe) {
        const eS = job.control.emailScheduler

        log('sending advanced math prerequisites...')
        eS.sendAfter('unlock-mul', 3)
        eS.sendAfter('unlock-div', 4)
        eS.sendAfter('unlock-mod', 5)
    },

    verify: function(probe) {
        const sT = probe.dusty.spy.state()

        const mulList = sT.capsule.filter(e => e === 'MUL')
        const divList = sT.capsule.filter(e => e === 'DIV')
        const modList = sT.capsule.filter(e => e === 'MOD')

        if (mulList.length > 0 && divList.length > 0 && modList.length > 0) return true
        return false
    },

    // next custom actions after the experiment is completed
    next: function(probe) {},
}
module.exports = experiment
