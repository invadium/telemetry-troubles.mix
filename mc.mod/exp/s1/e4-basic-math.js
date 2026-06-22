const experiment = {
    title:     'Basic Math Functions Test',
    reward:     750,

    verify: function(probe, MC) {
        const sT = probe.dusty.spy.state()

        const addList = sT.capsule.filter(e => e === 'ADD')
        const subList = sT.capsule.filter(e => e === 'SUB')

        if (addList.length > 0 && subList.length > 0) return true
        return false
    }
}
module.exports = experiment
