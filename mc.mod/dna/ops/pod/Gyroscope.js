const Pod = require('/mod/mc/dna/ops/pod/Pod')

// provides attitude telemetry
class Gyroscope extends Pod {

    constructor(st) {
        super( augment({
            name: 'gyroscope',
        }, st) )
        this.powerOn()
    }

    powerOff() {
        // can't be powered off - always on!
    }

    startTelemetry() {
        super.startTelemetry()
        lab.glare.hidden = false
    }

    stopTelemetry() {
        super.stopTelemetry()
        lab.glare.hidden = true
    }

}
