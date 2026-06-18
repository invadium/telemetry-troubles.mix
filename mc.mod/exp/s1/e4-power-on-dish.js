const experiment = {
    title:     'Experiment 2',
    reward:     1000,

    verify: function(probe, MC) {
        log('verifying that the telemetry on datalinees #1-8 is open...')

        for (let i = 1; i < 4; i++) {
            if (!probe.dataLines[i].telemetry) return false
        }
        return true
    }
}

module.exports = experiment
