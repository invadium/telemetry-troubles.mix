class Pod {

    constructor(st) {
        augment( this, {
            type:     'pod',
            power:     false,
            telemetry: false,
            poweredAt: 0,

            stats: {
                power:       5,
                science:     1,
                engineering: 2,
            },

            x: 0,
            y: 0,
            w: 0,
            h: 0,
            _centered: true,
        }, st )
    }

    startTelemetry() {
        this.telemetry = true
    }

    stopTelemetry() {
        this.telemetry = false
    }

    isTelemetric() {
        return true
    }

    powerOn() {
        this.power = true
        this.poweredAt = env.time
    }

    powerOff() {
        this.power = false
    }

    isPowerControlled() {
        return true
    }

}
