const experiment = {
    title:     'Basic Math Functions Test',
    reward:     750,
    hold:       5,

    prerequisites: function(probe) {
        const eS = job.control.emailScheduler

        log('sending basic math prerequisites...')
        eS.sendAfter('unlock-add', 3)
        eS.sendAfter('unlock-sub', 4)
    },

    verify: function(probe) {
        const sT = probe.dusty.spy.state()

        const addList = sT.capsule.filter(e => e === 'ADD')
        const subList = sT.capsule.filter(e => e === 'SUB')

        if (addList.length > 0 && subList.length > 0) return true
        return false
    },
}
module.exports = experiment
