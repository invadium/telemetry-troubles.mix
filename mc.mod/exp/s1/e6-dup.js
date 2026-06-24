const experiment = {
    title:     'Duplicate the Top DataStack Value',
    reward:     400,
    hold:       7,

    prerequisites: function(probe) {
        const eS = job.control.emailScheduler
        eS.sendAfter('unlock-dup', 2)
    },

    verify: function(probe, MC) {
        const sT = probe.dusty.spy.state()

        const n1 = sT.dstack[ sT.dstack.length - 1 ]
        const n2 = sT.dstack[ sT.dstack.length - 2 ]

        if (n1 === n2) return true
        return false
    },
}
module.exports = experiment
