class Pod {

    constructor(st) {
        augment( this, {
            type:     'pod',
            power:     false,
            telemetry: false,
            poweredAt: 0,

            stats: {
                power:       0,
                science:     0,
                engineering: 0,
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

    in() {
        return 0
    }

    isReadable() {
        return false
    }

    out(val) {
        // TODO return an error here?
        return false
    }

    isWritable() {
        return false
    }

    evoPower(dt) {
        if (!this.power || !this.stats.power) return

        const energy = this.__.battery.consume(this.stats.power, dt)
        if (energy === 0) {
            log(`[${this.name}] emergency turn off`)
            this.powerOff()
        }
    }

    evo(dt) {
        this.evoPower(dt)
    }
}
