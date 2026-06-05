class Pod {

    constructor(st) {
        augment( this, {
            power:     false,
            telemetry: false,
            poweredAt: 0,

            stats: {
                power:       5,
                science:     1,
                engineering: 2,
            },
        }, st )
    }

    startTelemetry() {
        this.telemetry = true
    }

    stopTelemetry() {
        this.telemetry = false
    }

    powerOn() {
        this.power = true
        this.poweredAt = env.time
    }

    powerOff() {
        this.power = false
    }

}
