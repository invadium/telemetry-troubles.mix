const experiment = {
    title:     'RTG and Battery Telemetry',
    reward:     1000,

    verify: function(probe, MC) {
        log('verifying that the telemetry on datalinees #1-2 is open...')

        for (let i = 1; i < 2; i++) {
            if (!probe.dataLines[i].telemetry) return false
        }
        return true
    }
}
module.exports = experiment
